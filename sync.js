const API="https://script.google.com/macros/s/AKfycbxAZoRF--h6xKLrQL8CghpQ1GjRRLUV6T8QwPxDLxhZptd9Xjkqai6o8SLy0y7ke5lg/exec";

document.addEventListener("DOMContentLoaded", function(){

    document.getElementById("downloadDB").onclick = async () => {
        try {
            const res = await fetch(API + "?action=employees");
            const data = await res.json();
            saveEmployees(data);
            alert("Database downloaded. You can now scan offline.");
        } catch(err){
            alert("Download failed:\n" + err);
        }
    };

    document.getElementById("syncBtn").onclick = async () => {

        if(!confirm("Upload today's logs?")) return;

        let logs = JSON.parse(localStorage.getItem("logs") || "[]");

        if(logs.length === 0){
            alert("No logs saved");
            return;
        }

        let formData = new FormData();
        formData.append("logs", JSON.stringify(logs));

        try{
            const res = await fetch(API,{
                method:"POST",
                body: formData
            });

            const text = await res.text();
            alert("Upload success");
            localStorage.removeItem("logs");

        }catch(err){
            alert("UPLOAD FAILED:\n" + err);
        }
    };


});

