let employees = {};
let scannedToday = {};

const ROUTES = [
"SAN AGUSTIN","ALAMINOS","CALAMBA","EXPAT","GATE 1 FPIP",
"LIMA","MALVAR","PRIVATE VEHICLE","SAMBAT","SM LIPA",
"STO TOMAS","TANAUAN","WALK IN"
];

window.onload = () => {
    const select = document.getElementById("routeSelect");
    ROUTES.forEach(r=>{
        let opt=document.createElement("option");
        opt.value=r;
        opt.text=r;
        select.appendChild(opt);
    });
};

function saveEmployees(data){
    employees=data;
    localStorage.setItem("employees",JSON.stringify(data));
}

function loadEmployees(){
    employees=JSON.parse(localStorage.getItem("employees")||"{}");
}

function saveLog(log){
    let logs=JSON.parse(localStorage.getItem("logs")||"[]");
    logs.push(log);
    localStorage.setItem("logs",JSON.stringify(logs));
}