import { Selector } from "testcafe";
const axios = require('axios');

fixture`Code Test for Alio IT`
    .page`http://localhost:3001/`;

test("Test 1", async t => {
        // Test 1.1 Make an API call to retrieve the list of devices
        let response = await axios
            .get("http://localhost:3000/devices")
            .catch( error => {
                console.log("There is an error with the request.");
                console.log(error);
            })
        let devices = response.data;
    
        console.log(`The list of devices is:`);
        devices.forEach(element => {
            console.log(element);
        });

        // Test 1.2 Check the elements are visible in the DOM
        for(let i = 0; i < devices.length; i++){
            console.log("testing: " + devices[i]["system_name"]);
            await t.expect(await  Selector(".device-main-box")
                .child(".device-info")
                .child(".device-name")
                .withText(devices[i]["system_name"])
                .visible)
                .ok();
            await t.expect(await Selector(".device-main-box")
                .child(".device-info")
                .child(".device-type")
                .withText(devices[i]["type"])
                .visible)
                .ok();
            await t.expect(await Selector(".device-main-box")
                .child(".device-info")
                .child(".device-capacity")
                .withText(devices[i]["hdd_capacity"])
                .visible)
                .ok();
        }

        // Test 1.3 Verify that all devices contain the edit and delete buttons
        for(let i = 0; i < devices.length; i++){
            await t.expect(await Selector(".list-devices")
            .child(".device-main-box")
            .nth(i)
            .child(".device-options")
            .child(".device-edit").exists).ok();

            await t.expect(await Selector(".list-devices")
            .child(".device-main-box")
            .nth(i)
            .child(".device-options")
            .child(".device-remove").exists).ok();
        }
})

test("Test 2", async t => {

    var deviceTypes = ["WINDOWS_WORKSTATION", "WINDOWS_SERVER", "MAC"];
    var names = ["Mouse", "Kira", "Denji", "Makima", "David", "Adam"];

    for(let i = 0; i < deviceTypes.length; i++) {
        let deviceCapacity = String(Math.round(Math.random() * 1000));
        const submitButton = Selector(".submitButton")
        await t.click(submitButton);
    
        await t.expect(Selector(".device-form").exists).ok();
    
        await t.typeText(Selector("#system_name"), names[i]);
    
        const typeSelect = await Selector("#type");
        const typeOptions = await typeSelect.find('option');
    
        await t.click(typeSelect)
        .click(typeOptions.withText(deviceTypes[i].replace("_", " ")))
        .expect(typeSelect.value).eql(deviceTypes[i]);

        await t.typeText(Selector("#hdd_capacity"), deviceCapacity);

        await t.click(Selector(".submitButton"));

        await t.expect(await Selector(".device-main-box")
            .child(".device-info")
            .child(".device-name")
            .withText(names[i])
            .visible)
            .ok();
        await t.expect(await Selector(".device-main-box")
            .child(".device-info")
            .child(".device-type")
            .withText(deviceTypes[i])
            .visible)
            .ok();
        await t.expect(await Selector(".device-main-box")
            .child(".device-info")
            .child(".device-capacity")
            .withText(deviceCapacity)
            .visible)
            .ok();
        }
})

test("Test 3", async t => {
    let response = await axios
        .get("http://localhost:3000/devices")
        .catch( error => {
            console.log("There is an error with the request.");
            console.log(error);
        })
    let devices = response.data;
    let first_device = devices[0];

    first_device["system_name"] = "Rename Device";
    console.log("First device:\n" + first_device);
    
    await axios
    .put(`http://localhost:3000/devices/${first_device["id"]}`, first_device)
    .catch(e => {
        console.log("Request failed" + e);
    })

    await t.eval(() => location.reload(true));

    await t.expect(await  Selector(".device-main-box")
        .child(".device-info")
        .child(".device-name")
        .withText(first_device["system_name"])
        .visible)
        .ok();
    await t.expect(await Selector(".device-main-box")
        .child(".device-info")
        .child(".device-type")
        .withText(first_device["type"])
        .visible)
        .ok();
    await t.expect(await Selector(".device-main-box")
        .child(".device-info")
        .child(".device-capacity")
        .withText(first_device["hdd_capacity"])
        .visible)
        .ok();
})

test("Test 4", async t => {
    let response = await axios
        .get("http://localhost:3000/devices")
        .catch( error => {
            console.log("There is an error with the request.");
            console.log(error);
        })
    let devices = response.data;

    let last_device = devices[devices.length - 1];
    await axios.delete(`http://localhost:3000/devices/${last_device["id"]}`);
    await t.eval(() => location.reload(true));
    console.log("Last device:\n" + last_device);

    await t.expect(await  Selector(".device-main-box")
        .child(".device-info")
        .child(".device-name")
        .withText(last_device["system_name"])
        .visible)
        .notOk()
})