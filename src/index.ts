import axios, { AxiosResponse } from 'axios'
import * as WebSocket from 'ws'
import { EventEmitter } from 'events'
import { ElementApiOptions, ElementResponse, Device, Options, Tag, Reading, CreateDeviceInterface, DeviceInterface, ElementActionResponse, Packet } from './models'

const raterLimiter = async (response: AxiosResponse): Promise<unknown> => {

    const rateLimitRemaining = response.headers['x-ratelimit-remaining']
    const rateLimitReset = response.headers['x-ratelimit-reset']
    console.log(`Rate limit remaining ${rateLimitRemaining}`)
    if (rateLimitRemaining === 0) {
        console.log(`Rate limit reset in ${rateLimitReset}`)
        return new Promise(resolve => setTimeout(resolve, rateLimitReset))
    }
    return Promise.resolve()
}

export class ElementKit {

    private apiKey: string
    private serviceUrl: string

    constructor(options: ElementApiOptions) {
        if (options.apiKey === undefined || options.apiKey === '') {
            throw new Error("Missing api key")
        }
        if (options.serviceUrl !== undefined &&
            (!options.serviceUrl.startsWith('https') || !options.serviceUrl.startsWith('http'))) {
            throw new Error("serviceUrl must start with https")
        }

        this.apiKey = options.apiKey
        this.serviceUrl = options.serviceUrl || "https://element-iot.com"
    }
    async getDevice(elementDeviceId: string): Promise<ElementResponse<Device>> {
        return (await axios.get(`${this.serviceUrl}/api/v1/devices/${elementDeviceId}?auth=${this.apiKey}`)).data
    }

    async findDeviceByDevEUI(deviceEUI: string): Promise<ElementResponse<Device[]>> {
        return (await axios.get(`${this.serviceUrl}/api/v1/devices/by-eui/${deviceEUI}?auth=${this.apiKey}`)).data
    }

    async getTag(tagId: string): Promise<Tag> {
        return (await axios.get<ElementResponse<Tag>>(`${this.serviceUrl}/api/v1/tags/${tagId}?auth=${this.apiKey}`)).data.body
    }

    async getTags(options?: Options): Promise<Tag[]> {
        if (options?.limit && options?.limit <= 100) {
            return (await axios.get<ElementResponse<Tag[]>>(`${this.serviceUrl}/api/v1/tags?auth=${this.apiKey}${this.createParams(options)}`)).data.body
        } else {
            return this.paginate<Tag[]>(`tags`, options)
        }
    }

    async getDevicesByTagId(tagId: string, options?: Options): Promise<Device[]> {
        if (options?.limit && options?.limit <= 100) {
            return (await axios.get<ElementResponse<Device[]>>(`${this.serviceUrl}/api/v1/tags/${tagId}/devices?auth=${this.apiKey}${this.createParams(options)}`)).data.body
        } else {
            return this.paginate<Device[]>(`tags/${tagId}/devices`, options)
        }
    }

    async getDevices(options?: Options): Promise<Device[]> {
        if (options?.limit && options?.limit <= 100) {
            return (await axios.get<ElementResponse<Device[]>>(`${this.serviceUrl}/api/v1/devices?auth=${this.apiKey}${this.createParams(options)}`)).data.body
        } else {
            return this.paginate<Device[]>(`devices`, options)
        }
    }

    async getReadingsByTagId(tagId: string, options?: Options): Promise<Reading[]> {
        if (options?.limit && options?.limit <= 100) {
            return (await axios.get<ElementResponse<Reading[]>>(`${this.serviceUrl}/api/v1/tags/${tagId}/readings?auth=${this.apiKey}${this.createParams(options)}`)).data.body
        } else {
            return this.paginate<Reading[]>(`tags/${tagId}/readings`, options)
        }
    }

    async getPacketsByTagId(tagId: string, options?: Options): Promise<Packet[]> {
        if (options?.limit && options?.limit <= 100) {
            return (await axios.get<ElementResponse<Packet[]>>(`${this.serviceUrl}/api/v1/tags/${tagId}/packets?auth=${this.apiKey}${this.createParams(options)}`)).data.body
        } else {
            return this.paginate<Packet[]>(`tags/${tagId}/packets`, options)
        }
    }

    async getPackets(deviceId: string, options?: Options): Promise<Packet[]> {
        if (options?.limit && options?.limit <= 100) {
            return (await axios.get(`${this.serviceUrl}/api/v1/devices/${deviceId}/packets?auth=${this.apiKey}${this.createParams(options)}`)).data.body
        } else {
            return this.paginate<Packet[]>(`devices/${deviceId}/packets`, options)
        }
    }
    async getReadings(deviceId: string, options?: Options): Promise<Reading[]> {
        if (options?.limit && options?.limit <= 100) {
            return (await axios.get(`${this.serviceUrl}/api/v1/devices/${deviceId}/readings?auth=${this.apiKey}${this.createParams(options)}`)).data.body
        } else {
            return this.paginate<Reading[]>(`devices/${deviceId}/readings`, options)
        }
    }

    private createParams(options: Options): string {
        let params = ""
        if (options.limit) {
            params += `&limit=${options.limit}`
        }

        if (options.retrieveAfterId) {
            params += `&retrieve_after=${options.retrieveAfterId}`
        }

        if (options.sort) {
            params += `&sort=${options.sort}`
        }

        if (options.sortDirection) {
            params += `&sort_direction=${options.sortDirection}`
        }

        if (options.filter) {
            params += `&filter=${encodeURIComponent(options.filter)}`
        }

        return params
    }

    private async paginate<T>(resource: string, options?: Options) {
        let retrieveAfterId = undefined
        let values = []
        do {
            const params = this.createParams({
                limit: 100,
                retrieveAfterId, ...options
            })
            const response = (await axios.get<ElementResponse<T>>(`${this.serviceUrl}/api/v1/${resource}?auth=${this.apiKey}${params}`))
            values = values.concat(response.data.body)
            retrieveAfterId = response.data.retrieve_after_id

            await raterLimiter(response)

        } while (retrieveAfterId !== undefined)
        return values

    }

    async createDevice(name: string, tagId: string): Promise<ElementResponse<Device>> {
        return (await axios.post(`${this.serviceUrl}/api/v1/devices?auth=${this.apiKey}`, {
            device: {
                name: name,
                tags: [{
                    id: tagId
                }]
            }
        })).data
    }

    async deleteDevice(deviceId: string): Promise<ElementResponse<unknown>> {
        return await axios.delete(`${this.serviceUrl}/api/v1/devices/${deviceId}?auth=${this.apiKey}`)
    }

    async addInterfaceToDevice(deviceId: string, deviceInterface: CreateDeviceInterface): Promise<DeviceInterface> {
        return (await axios.post(`${this.serviceUrl}/api/v1/devices/${deviceId}/interfaces?auth=${this.apiKey}`, {
            interface: deviceInterface
        })).data
    }

    async deleteInterface(deviceId: string, interfaceId: string): Promise<ElementResponse<unknown>> {
        return (await axios.delete(`${this.serviceUrl}/api/v1/devices/${deviceId}/interfaces/${interfaceId}?auth=${this.apiKey}`)).data
    }

    async listInterfaces(deviceId: string): Promise<ElementResponse<DeviceInterface[]>> {
        return (await axios.get(`${this.serviceUrl}/api/v1/devices/${deviceId}/interfaces?auth=${this.apiKey}`)).data
    }

    async createAction(deviceId: string, interfaceId: string, opts: unknown): Promise<ElementActionResponse> {
        return (await axios.post(`${this.serviceUrl}/api/v1/devices/${deviceId}/interfaces/${interfaceId}/actions/send_down_frame?auth=${this.apiKey}`, {
            opts
        })).data
    }
}

export class ElementKitWS extends EventEmitter {

    private apiKey: string
    private serviceUrl: string
    pingTimeout: NodeJS.Timeout
    ws: WebSocket
    type: string

    constructor(options: ElementApiOptions, type: 'readings' | 'packets', tagId?: string) {
        super()
        if (options.apiKey === undefined || options.apiKey === '') {
            throw new Error("Missing api key")
        }
        if (options.serviceUrl !== undefined &&
            (!options.serviceUrl.startsWith('wss') || !options.serviceUrl.startsWith('ws'))) {
            throw new Error("serviceUrl must start with ws:// or wss://")
        }

        this.apiKey = options.apiKey
        this.serviceUrl = options.serviceUrl || "wss://element-iot.com"
        this.type = type


        if (tagId) {
            this.ws = new WebSocket(`${this.serviceUrl}/api/v1/tags/${tagId}/${type}/socket?auth=${this.apiKey}`);
        } else {
            this.ws = new WebSocket(`${this.serviceUrl}/api/v1/${type}/socket?auth=${this.apiKey}`)
        }

        this.ws.on('open', this.open.bind(this));
        this.ws.on('ping', this.heartbeat.bind(this));
        this.ws.on('close', function () {
            clearTimeout(this.pingTimeout);
        }.bind(this));
        this.ws.on('error', function onError(error) {
            this.emit('error', error)
        }.bind(this))
        this.ws.on('message', this.onMessage.bind(this))
    }

    private onMessage(message: WebSocket.Data) {
        const messageString = message.toString('utf-8')
        if (message !== 'pong') {
            try {
                const data = JSON.parse(messageString)[0]
                if (data.event === 'reading_added') {
                    this.emit('readings', { ...data.body })
                } else if (data.event === 'packet_added') {
                    this.emit('packets', { ...data.body })
                }

            } catch (error) {
                console.error(error);
            }
        }
    }
    private open() {
        console.info("ELEMENT Kit Connection open")
        this.emit("open")
        this.heartbeat()
    }

    private heartbeat() {
        console.info("ELEMENT Kit sending heartbeat")
        clearTimeout(this.pingTimeout)
        this.pingTimeout = setTimeout(function () {
            this.heartbeat()
        }.bind(this), 30000 + 1000)
        this.ws.ping()
    }
}