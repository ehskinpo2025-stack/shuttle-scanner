loadEmployees();

const result=document.getElementById("result");

function show(status,data){
    result.className=status;

    document.getElementById("status").innerText=status.toUpperCase();
    document.getElementById("name").innerText=data?.name||"";
    document.getElementById("dept").innerText=data?.dept||"";
    document.getElementById("station").innerText=data?.station||"";
    document.getElementById("route").innerText=data?.route||"";
}

function onScanSuccess(decodedText){

    let emp=employees[decodedText];
    let selected=document.getElementById("routeSelect").value;

    let now=new Date();
    let date=now.toISOString().split("T")[0];
    let time=now.toTimeString().split(" ")[0];

    if(!emp){
        show("denied",{});
        saveLog({date,time,id:decodedText,status:"ACCESS DENIED"});
        return;
    }

    let duplicate=scannedToday[decodedText]?"YES":"NO";
    scannedToday[decodedText]=true;

    let status=(emp.route===selected)?"ACCESS GRANTED":"ACCESS DENIED";
    show(status==="ACCESS GRANTED"?"granted":"denied",emp);

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