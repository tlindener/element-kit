import { ElementKit } from '../src/index'
import axios from 'axios';
jest.mock('axios')
const mockedAxios = axios as jest.Mocked<typeof axios>;

it('should throw an error if no api key is set', () => {
    expect(() => { new ElementKit({ apiKey: '' }) }).toThrow(Error);
});

describe('tags', () => {
    it('fetches tags successfully from element iot', async () => {
        const data = { "status": 200, "retrieve_after_id": "39a74ea4-0594-48d5-909c-9935e12889ae", "ok": true, "body": [{ "updated_at": "2020-10-20T13:32:37.885265Z", "slug": "kundenstruktur-netz-immobilie-1-stockwerk-1", "parent_id": "d8e4c1aa-de8f-41a8-aab4-ad7258deb94d", "name": "Kundenstruktur / Netz / Immobilie 1 / stockwerk 1", "mandate_id": "9091fd17-62d8-4f6c-aea0-21bc441b4ee9", "inserted_at": "2020-10-20T13:32:37.885265Z", "id": "c70fa7e0-280d-44fa-a554-77823ddb939d", "group_interface_id": null, "description": null, "default_readings_view_id": null, "default_packets_view_id": null, "default_layers_id": null, "default_graph_preset_id": null, "default_devices_view_id": null, "color_hue": 200 }, { "updated_at": "2020-10-20T13:32:28.249428Z", "slug": "kundenstruktur-netz-immobilie-1", "parent_id": "b975b794-4798-4a00-aff9-b9fa84ddbe36", "name": "Kundenstruktur / Netz / Immobilie 1", "mandate_id": "9091fd17-62d8-4f6c-aea0-21bc441b4ee9", "inserted_at": "2020-10-20T13:32:28.249428Z", "id": "d8e4c1aa-de8f-41a8-aab4-ad7258deb94d", "group_interface_id": null, "description": null, "default_readings_view_id": null, "default_packets_view_id": null, "default_layers_id": null, "default_graph_preset_id": null, "default_devices_view_id": null, "color_hue": 200 }, { "updated_at": "2020-10-20T13:24:26.967691Z", "slug": "kundenstruktur-vertrieb", "parent_id": "a4edc378-10cd-472d-b3be-3b506cc9a23a", "name": "Kundenstruktur / Vertrieb", "mandate_id": "9091fd17-62d8-4f6c-aea0-21bc441b4ee9", "inserted_at": "2020-10-20T13:24:26.967691Z", "id": "7a1e7e38-75b9-4151-b414-7a0a6146811d", "group_interface_id": null, "description": null, "default_readings_view_id": null, "default_packets_view_id": null, "default_layers_id": null, "default_graph_preset_id": null, "default_devices_view_id": null, "color_hue": 200 }, { "updated_at": "2020-10-20T13:24:18.988832Z", "slug": "kundenstruktur-netz", "parent_id": "a4edc378-10cd-472d-b3be-3b506cc9a23a", "name": "Kundenstruktur / Netz", "mandate_id": "9091fd17-62d8-4f6c-aea0-21bc441b4ee9", "inserted_at": "2020-10-20T13:24:18.988832Z", "id": "b975b794-4798-4a00-aff9-b9fa84ddbe36", "group_interface_id": null, "description": null, "default_readings_view_id": null, "default_packets_view_id": null, "default_layers_id": null, "default_graph_preset_id": null, "default_devices_view_id": null, "color_hue": 200 }, { "updated_at": "2020-10-20T13:24:09.783169Z", "slug": "kundenstruktur", "parent_id": null, "name": "Kundenstruktur", "mandate_id": "9091fd17-62d8-4f6c-aea0-21bc441b4ee9", "inserted_at": "2020-10-20T13:24:09.783169Z", "id": "a4edc378-10cd-472d-b3be-3b506cc9a23a", "group_interface_id": null, "description": null, "default_readings_view_id": null, "default_packets_view_id": null, "default_layers_id": null, "default_graph_preset_id": null, "default_devices_view_id": null, "color_hue": 200 }, { "updated_at": "2020-10-14T08:33:26.043634Z", "slug": "werkstatt-alex-hallo", "parent_id": "0f3a913d-ab03-46f7-9fb4-0630bcca982b", "name": "Werkstatt / Alex / hallo", "mandate_id": "9091fd17-62d8-4f6c-aea0-21bc441b4ee9", "inserted_at": "2020-10-14T08:33:26.043634Z", "id": "15b556fb-5ea4-4c46-af87-77f29c1c8708", "group_interface_id": null, "description": null, "default_readings_view_id": null, "default_packets_view_id": null, "default_layers_id": null, "default_graph_preset_id": null, "default_devices_view_id": null, "color_hue": 200 }, { "updated_at": "2020-10-14T08:32:18.821670Z", "slug": "tobias-cool", "parent_id": "9cbd0ac5-70eb-431e-997b-dcf2c9baeebe", "name": "Tobias / Cool", "mandate_id": "9091fd17-62d8-4f6c-aea0-21bc441b4ee9", "inserted_at": "2020-10-14T08:32:18.603167Z", "id": "b33dcb6c-c547-4e3b-b0a1-70782af3104b", "group_interface_id": null, "description": null, "default_readings_view_id": null, "default_packets_view_id": null, "default_layers_id": null, "default_graph_preset_id": null, "default_devices_view_id": null, "color_hue": 200 }, { "updated_at": "2020-10-14T08:31:40.505724Z", "slug": "werkstatt-alex-test", "parent_id": "0f3a913d-ab03-46f7-9fb4-0630bcca982b", "name": "Werkstatt / Alex / test", "mandate_id": "9091fd17-62d8-4f6c-aea0-21bc441b4ee9", "inserted_at": "2020-10-14T08:31:40.505724Z", "id": "973f56f3-1f6c-44bb-b46c-d798b45f41ee", "group_interface_id": null, "description": null, "default_readings_view_id": null, "default_packets_view_id": null, "default_layers_id": null, "default_graph_preset_id": null, "default_devices_view_id": null, "color_hue": 200 }, { "updated_at": "2020-10-14T08:01:01.906225Z", "slug": "tobias-ausgebaut", "parent_id": "9cbd0ac5-70eb-431e-997b-dcf2c9baeebe", "name": "Tobias / Ausgebaut", "mandate_id": "9091fd17-62d8-4f6c-aea0-21bc441b4ee9", "inserted_at": "2020-10-14T07:21:22.969305Z", "id": "4ebf2de1-b3ff-4727-839b-70b10b6156cb", "group_interface_id": null, "description": null, "default_readings_view_id": null, "default_packets_view_id": null, "default_layers_id": null, "default_graph_preset_id": null, "default_devices_view_id": null, "color_hue": 200 }, { "updated_at": "2020-10-14T07:05:40.611771Z", "slug": "test-matthias", "parent_id": "e04f5cb8-5e2e-4a0c-affa-7e0bdfbc6951", "name": "test / Matthias", "mandate_id": "9091fd17-62d8-4f6c-aea0-21bc441b4ee9", "inserted_at": "2020-10-14T07:05:40.611771Z", "id": "39a74ea4-0594-48d5-909c-9935e12889ae", "group_interface_id": null, "description": null, "default_readings_view_id": null, "default_packets_view_id": null, "default_layers_id": null, "default_graph_preset_id": null, "default_devices_view_id": null, "color_hue": 200 }] };

        mockedAxios.get.mockResolvedValueOnce({ data })
        const kit = new ElementKit({ apiKey: 'my-api-key' })

        await expect(kit.getTags({ limit: 10 })).resolves.toEqual([
            {
                "updated_at": "2020-10-20T13:32:37.885265Z",
                "slug": "kundenstruktur-netz-immobilie-1-stockwerk-1",
                "parent_id": "d8e4c1aa-de8f-41a8-aab4-ad7258deb94d",
                "name": "Kundenstruktur / Netz / Immobilie 1 / stockwerk 1",
                "mandate_id": "9091fd17-62d8-4f6c-aea0-21bc441b4ee9",
                "inserted_at": "2020-10-20T13:32:37.885265Z",
                "id": "c70fa7e0-280d-44fa-a554-77823ddb939d",
                "group_interface_id": null,
                "description": null,
                "default_readings_view_id": null,
                "default_packets_view_id": null,
                "default_layers_id": null,
                "default_graph_preset_id": null,
                "default_devices_view_id": null,
                "color_hue": 200
            },
            {
                "updated_at": "2020-10-20T13:32:28.249428Z",
                "slug": "kundenstruktur-netz-immobilie-1",
                "parent_id": "b975b794-4798-4a00-aff9-b9fa84ddbe36",
                "name": "Kundenstruktur / Netz / Immobilie 1",
                "mandate_id": "9091fd17-62d8-4f6c-aea0-21bc441b4ee9",
                "inserted_at": "2020-10-20T13:32:28.249428Z",
                "id": "d8e4c1aa-de8f-41a8-aab4-ad7258deb94d",
                "group_interface_id": null,
                "description": null,
                "default_readings_view_id": null,
                "default_packets_view_id": null,
                "default_layers_id": null,
                "default_graph_preset_id": null,
                "default_devices_view_id": null,
                "color_hue": 200
            },
            {
                "updated_at": "2020-10-20T13:24:26.967691Z",
                "slug": "kundenstruktur-vertrieb",
                "parent_id": "a4edc378-10cd-472d-b3be-3b506cc9a23a",
                "name": "Kundenstruktur / Vertrieb",
                "mandate_id": "9091fd17-62d8-4f6c-aea0-21bc441b4ee9",
                "inserted_at": "2020-10-20T13:24:26.967691Z",
                "id": "7a1e7e38-75b9-4151-b414-7a0a6146811d",
                "group_interface_id": null,
                "description": null,
                "default_readings_view_id": null,
                "default_packets_view_id": null,
                "default_layers_id": null,
                "default_graph_preset_id": null,
                "default_devices_view_id": null,
                "color_hue": 200
            },
            {
                "updated_at": "2020-10-20T13:24:18.988832Z",
                "slug": "kundenstruktur-netz",
                "parent_id": "a4edc378-10cd-472d-b3be-3b506cc9a23a",
                "name": "Kundenstruktur / Netz",
                "mandate_id": "9091fd17-62d8-4f6c-aea0-21bc441b4ee9",
                "inserted_at": "2020-10-20T13:24:18.988832Z",
                "id": "b975b794-4798-4a00-aff9-b9fa84ddbe36",
                "group_interface_id": null,
                "description": null,
                "default_readings_view_id": null,
                "default_packets_view_id": null,
                "default_layers_id": null,
                "default_graph_preset_id": null,
                "default_devices_view_id": null,
                "color_hue": 200
            },
            {
                "updated_at": "2020-10-20T13:24:09.783169Z",
                "slug": "kundenstruktur",
                "parent_id": null,
                "name": "Kundenstruktur",
                "mandate_id": "9091fd17-62d8-4f6c-aea0-21bc441b4ee9",
                "inserted_at": "2020-10-20T13:24:09.783169Z",
                "id": "a4edc378-10cd-472d-b3be-3b506cc9a23a",
                "group_interface_id": null,
                "description": null,
                "default_readings_view_id": null,
                "default_packets_view_id": null,
                "default_layers_id": null,
                "default_graph_preset_id": null,
                "default_devices_view_id": null,
                "color_hue": 200
            },
            {
                "updated_at": "2020-10-14T08:33:26.043634Z",
                "slug": "werkstatt-alex-hallo",
                "parent_id": "0f3a913d-ab03-46f7-9fb4-0630bcca982b",
                "name": "Werkstatt / Alex / hallo",
                "mandate_id": "9091fd17-62d8-4f6c-aea0-21bc441b4ee9",
                "inserted_at": "2020-10-14T08:33:26.043634Z",
                "id": "15b556fb-5ea4-4c46-af87-77f29c1c8708",
                "group_interface_id": null,
                "description": null,
                "default_readings_view_id": null,
                "default_packets_view_id": null,
                "default_layers_id": null,
                "default_graph_preset_id": null,
                "default_devices_view_id": null,
                "color_hue": 200
            },
            {
                "updated_at": "2020-10-14T08:32:18.821670Z",
                "slug": "tobias-cool",
                "parent_id": "9cbd0ac5-70eb-431e-997b-dcf2c9baeebe",
                "name": "Tobias / Cool",
                "mandate_id": "9091fd17-62d8-4f6c-aea0-21bc441b4ee9",
                "inserted_at": "2020-10-14T08:32:18.603167Z",
                "id": "b33dcb6c-c547-4e3b-b0a1-70782af3104b",
                "group_interface_id": null,
                "description": null,
                "default_readings_view_id": null,
                "default_packets_view_id": null,
                "default_layers_id": null,
                "default_graph_preset_id": null,
                "default_devices_view_id": null,
                "color_hue": 200
            },
            {
                "updated_at": "2020-10-14T08:31:40.505724Z",
                "slug": "werkstatt-alex-test",
                "parent_id": "0f3a913d-ab03-46f7-9fb4-0630bcca982b",
                "name": "Werkstatt / Alex / test",
                "mandate_id": "9091fd17-62d8-4f6c-aea0-21bc441b4ee9",
                "inserted_at": "2020-10-14T08:31:40.505724Z",
                "id": "973f56f3-1f6c-44bb-b46c-d798b45f41ee",
                "group_interface_id": null,
                "description": null,
                "default_readings_view_id": null,
                "default_packets_view_id": null,
                "default_layers_id": null,
                "default_graph_preset_id": null,
                "default_devices_view_id": null,
                "color_hue": 200
            },
            {
                "updated_at": "2020-10-14T08:01:01.906225Z",
                "slug": "tobias-ausgebaut",
                "parent_id": "9cbd0ac5-70eb-431e-997b-dcf2c9baeebe",
                "name": "Tobias / Ausgebaut",
                "mandate_id": "9091fd17-62d8-4f6c-aea0-21bc441b4ee9",
                "inserted_at": "2020-10-14T07:21:22.969305Z",
                "id": "4ebf2de1-b3ff-4727-839b-70b10b6156cb",
                "group_interface_id": null,
                "description": null,
                "default_readings_view_id": null,
                "default_packets_view_id": null,
                "default_layers_id": null,
                "default_graph_preset_id": null,
                "default_devices_view_id": null,
                "color_hue": 200
            },
            {
                "updated_at": "2020-10-14T07:05:40.611771Z",
                "slug": "test-matthias",
                "parent_id": "e04f5cb8-5e2e-4a0c-affa-7e0bdfbc6951",
                "name": "test / Matthias",
                "mandate_id": "9091fd17-62d8-4f6c-aea0-21bc441b4ee9",
                "inserted_at": "2020-10-14T07:05:40.611771Z",
                "id": "39a74ea4-0594-48d5-909c-9935e12889ae",
                "group_interface_id": null,
                "description": null,
                "default_readings_view_id": null,
                "default_packets_view_id": null,
                "default_layers_id": null,
                "default_graph_preset_id": null,
                "default_devices_view_id": null,
                "color_hue": 200
            }
        ]);
    });

    it('fetches tags successfully from element iot', async () => {
        const data = {
            "status": 200,
            "ok": true,
            "body": {
                "updated_at": "2020-10-20T13:32:37.885265Z",
                "slug": "kundenstruktur-netz-immobilie-1-stockwerk-1",
                "profile_data": [],
                "parent_id": "d8e4c1aa-de8f-41a8-aab4-ad7258deb94d",
                "name": "Kundenstruktur / Netz / Immobilie 1 / stockwerk 1",
                "mandate_id": "9091fd17-62d8-4f6c-aea0-21bc441b4ee9",
                "inserted_at": "2020-10-20T13:32:37.885265Z",
                "id": "c70fa7e0-280d-44fa-a554-77823ddb939d",
                "group_interface_id": null,
                "fields": {},
                "description": null,
                "default_readings_view_id": null,
                "default_packets_view_id": null,
                "default_layers_id": null,
                "default_graph_preset_id": null,
                "default_devices_view_id": null,
                "color_hue": 200
            }
        }
        mockedAxios.get.mockResolvedValueOnce({ data })
        const kit = new ElementKit({ apiKey: 'my-api-key' })

        await expect(kit.getTag("tagId")).resolves.toEqual({
            "updated_at": "2020-10-20T13:32:37.885265Z",
            "slug": "kundenstruktur-netz-immobilie-1-stockwerk-1",
            "profile_data": [],
            "parent_id": "d8e4c1aa-de8f-41a8-aab4-ad7258deb94d",
            "name": "Kundenstruktur / Netz / Immobilie 1 / stockwerk 1",
            "mandate_id": "9091fd17-62d8-4f6c-aea0-21bc441b4ee9",
            "inserted_at": "2020-10-20T13:32:37.885265Z",
            "id": "c70fa7e0-280d-44fa-a554-77823ddb939d",
            "group_interface_id": null,
            "fields": {},
            "description": null,
            "default_readings_view_id": null,
            "default_packets_view_id": null,
            "default_layers_id": null,
            "default_graph_preset_id": null,
            "default_devices_view_id": null,
            "color_hue": 200
        });
    });
})
