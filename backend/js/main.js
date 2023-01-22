$("#submitbutton").click((e) => {
    const data = $(".formdata").serialize();
    console.log(data);
    $.post("/save", data, (result) => {
        console.log(result);
    });
    return false;
});

$("#link").click((e) => {
    $.post("/link", (e) => {
        console.log(e);
        $(".status").text(e);
    });
});
