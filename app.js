loadEmployees();

const result = document.getElementById("result");

let scannedToday = {};
let lastScan = "";
let lastScanTime = 0;

function show(status, data) {
    result.className = status;

    document.getElementById("status").innerText = status.toUpperCase();
    document.getElementById("name").innerText = data?.name || "";
    document.getElementById("dept").innerText = data?.dept || "";
    document.getElementById("station").innerText = data?.station || "";
    document.getElementById("route").innerText = data?.route || "";
}

// Prevent rapid duplicate scans
function ignoreRapidScan(id){
    const now = Date.now();
    if(id === lastScan && now - lastScanTime < 2500){
        return true;
    }
    lastScan = id;
    lastScanTime = now;
    return false;
}

function onScanSuccess(decodedText){

    if(ignoreRapidScan(decodedText)) return;

    const driver = document.getElementById("driverName").value.trim();
    const busNo = document.getElementById("busNo").value.trim();
    const selected = document.getElementById("routeSelect").value;

    // BLOCK scanning if required fields empty
    if(!driver || !busNo){
        alert("Please enter Bus Driver Name and Bus No before scanning.");
        return;
    }

    if(!selected){
        alert("Please select Bus Route first.");
        return;
    }

    let emp = employees[decodedText];

    let now = new Date();
    let date = now.toISOString().split("T")[0];
    let time = now.toTimeString().split(" ")[0];

    if(!emp){
        show("denied",{});

        saveLog({
            date,time,
            id:decodedText,
            status:"ACCESS DENIED",
            busRoute:selected,
            driver:driver,
            busNo:busNo
        });

        return;
    }

    let duplicate = scannedToday[decodedText] ? "YES" : "NO";
    scannedToday[decodedText] = true;

    let status = (emp.route === selected) ? "ACCESS GRANTED" : "ACCESS DENIED";

    show(status === "ACCESS GRANTED" ? "granted" : "denied", emp);

    saveLog({
        date,time,
        id:decodedText,
        name:emp.name,
        dept:emp.dept,
        station:emp.station,
        employeeRoute:emp.route,
        busRoute:selected,
        status,
        duplicate,
        device:navigator.userAgent,
        session:date,
        driver:driver,
        busNo:busNo
    });
}

const scanner = new Html5QrcodeScanner("reader",{fps:10,qrbox:250});
scanner.render(onScanSuccess);