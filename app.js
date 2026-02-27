loadEmployees();

const result=document.getElementById("result");
const screen=document.getElementById("gateScreen");
const gateStatus=document.getElementById("gateStatus");
const gateName=document.getElementById("gateName");

let lastScanID="";
let lastScanTime=0;

const okSound=new Audio("https://actions.google.com/sounds/v1/cartoon/wood_plank_flicks.ogg");
const badSound=new Audio("https://actions.google.com/sounds/v1/alarms/beep_short.ogg");

function showPanel(granted,name){
    screen.className="";
    screen.classList.add(granted?"passScreen":"failScreen");

    gateStatus.innerText=granted?"PASS":"DENIED";
    gateName.innerText=name||"";

    granted?okSound.play():badSound.play();

    setTimeout(()=>{
        screen.classList.add("hidden");
    },1200);
}

function show(status,data){
    result.className=status;

    document.getElementById("status").innerText=status.toUpperCase();
    document.getElementById("name").innerText=data?.name||"";
    document.getElementById("dept").innerText=data?.dept||"";
    document.getElementById("station").innerText=data?.station||"";
    document.getElementById("route").innerText=data?.route||"";
}

function isRapidScan(id){
    const now=Date.now();
    if(id===lastScanID && now-lastScanTime<2500){
        return true;
    }
    lastScanID=id;
    lastScanTime=now;
    return false;
}

function onScanSuccess(decodedText){

    if(isRapidScan(decodedText)) return;

    let emp=employees[decodedText];
    let selected=document.getElementById("routeSelect").value;

    let now=new Date();
    let date=now.toISOString().split("T")[0];
    let time=now.toTimeString().split(" ")[0];

    if(!emp){
        show("denied",{});
        showPanel(false,"UNKNOWN ID");
        saveLog({date,time,id:decodedText,status:"ACCESS DENIED"});
        return;
    }

    let duplicate=scannedToday[decodedText]?"YES":"NO";
    scannedToday[decodedText]=true;

    let granted=(emp.route===selected);
    let status=granted?"ACCESS GRANTED":"ACCESS DENIED";

    show(granted?"granted":"denied",emp);
    showPanel(granted,emp.name);

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
        session:date
    });
}

const scanner=new Html5QrcodeScanner("reader",{fps:10,qrbox:250});
scanner.render(onScanSuccess);