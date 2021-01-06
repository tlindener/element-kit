
export interface Options {
    limit?: number;
    sort?: 'inserted_at' | 'transceived_at';
    sortDirection?: 'asc' | 'desc';
    retrieveAfterId?: string;
    filter?: string;
    withProfile?: boolean
}

export interface Reading {
    id: string;
    device_id: string;
    transceived_at: Date;
    payload_encoding: string;
    payload: unknown;
    packet_type: string;
    meta: null | unknown;
    is_meta: boolean;
    interface_id: string;
    inserted_at: Date;
}
export interface Packet {
    id: string;
    payload: unknown;
    payload_encoding: string;
    packet_type: string;
    meta: unknown;
    transceived_at: Date;
    inserted_at: Date;
    is_meta: boolean;
}

export interface CreateDeviceInterface {
    name: string;
    driver_instance_id: string;
    opts: unknown;
    enabled: boolean;
}
export interface DeviceInterface {
    id: string;
    name: string;
    driver_instance_id: string;
    opts: unknown;
    enabled: boolean;
}

export interface ElementResponse<T> {
    status: number;
    ok: boolean;
    retrieve_after_id: null | string;
    body: T;
}

export interface Device {
    id: string;
    mandate_id: string;
    name: string;
    slug: string;
    parser_id: string | null;
    location?: Point;
    tags: Tag[];
    interfaces: DeviceInterface;
}
export interface Point {
    type: 'Point';
    coordinates: number[];
}
export interface Tag {
    updated_at: Date;
    slug: string;
    profile_data: [];
    parent_id: string | null;
    name: string;
    mandate_id: string;
    inserted_at: Date;
    id: string;
    group_interface_id: string | null;
    fields: unknown;
    description: string | null;
    default_readings_view_id: string | null;
    default_packets_view_id: string | null;
    default_layers_id: string | null;
    default_graph_preset_id: string | null;
    default_devices_view_id: string | null;
    color_hue: number;
}

export interface ElementApiOptions {
    rateLimit?: RateLimit;
    apiKey: string;
    serviceUrl?: string;
    logger?: (msg: string) => void
}
export interface RateLimit {
    remaining: number;
    reset: number;
}

export interface ElementActionResponse {
    updated_at: Date;
    type: 'send_down_frame' | unknown;
    state: 'pending' | unknown;
    result: null | unknown;
    order: null | unknown;
    opts: unknown;
    mandate_id: string;
    interface_id: string;
    inserted_at: Date;
    id: string;
    executed_at: null | Date;
    device_id: string;
}