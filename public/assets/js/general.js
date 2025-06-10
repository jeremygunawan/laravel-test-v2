function buttonLoading(button){
    let text = $(button).val();
    $(button).prop("disabled", true);
    $(button).data("oldval", text);
    $(button).val('Processing');
}

function buttonUnloading(button){
    let text = $(button).data('oldval');
    $(button).val(text);
    $(button).removeData('data-oldval');
    $(button).prop("disabled", false);
}