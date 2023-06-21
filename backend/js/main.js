$("#submitbutton").click((e) => {
    const data = $(".formdata").serialize();
   
    $.post("/save", data, (result) => {
       
    });
    return false;
});

$("#link").click((e) => {
    $.post("/link", (e) => {
        console.log(e);
        $(".status").text(e);
    });
});
