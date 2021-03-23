const ElementKit = require('./lib/index').ElementKit
const client = new ElementKit({
    apiKey: ''
})


const main = async () => {
    const devices = await client.getDevices({ withProfile: true })
    const processed = devices.map(p => {
        const device = {
            name: p.name,

        }
        for (const interface of p.interfaces) {
            if (interface.opts.device_eui) {
                device["DeviceEUI"] = interface.opts.device_eui
            }
        }

        for (const [i, v] of p.tags.entries()) {
            device[`Ordner ${i + 1}`] = v.name
        }

        for (const profile of p.profile_data) {

            for (const field of profile.profile.fields) {
                const data = profile.data[field.name]
                device[`${profile.profile.name} - ${field.display}`] = data
            }
        }
        return device
    })
    require('fs').writeFileSync('troisdorf.json', JSON.stringify(processed))
}

main()