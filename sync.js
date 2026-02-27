const API="https://script.google.com/macros/s/AKfycbxAZoRF--h6xKLrQL8CghpQ1GjRRLUV6T8QwPxDLxhZptd9Xjkqai6o8SLy0y7ke5lg/exec";

document.getElementById("downloadDB").onclick=async()=>{
    const res=await fetch(API+"?action=employees");
    const data=await res.json();
    saveEmployees(data);
    alert("Database downloaded. You can now scan offline.");
};

document.getElementById("syncBtn").onclick = async () => {

    if(!confirm("Upload today's logs?")) return;

    let logs = JSON.parse(localStorage.getItem("logs") || "[]");

    if(logs.length === 0){
        alert("No logs saved");
        return;
    }

    try{
        const res = await fetch(API,{
            method:"POST",
            body: JSON.stringify({logs: logs}),
            headers:{
                "Content-Type":"application/json"
            }
        });

        const text = await res.text();
        alert("SERVER RESPONSE:\n" + text);

        localStorage.removeItem("logs");

    }catch(err){
        alert("UPLOAD FAILED:\n" + err);
    }
};