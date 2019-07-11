console.log('quantity.js connected')

$(document).on('click', '#plus', (event)=> {
    event.preventDefault()

    let priceValue = parseFloat($('#priceValue').val())
    let quantity = parseFloat($('#quantity').val())

    priceValue += parseFloat($('#priceHidden').val())
    quantity += 1

    $('#quantity').val(quantity)
    $('#priceValue').val(priceValue.toFixed(2))
    $('#total').html(quantity)
})

$(document).on('click', '#minus', (event)=> {
    event.preventDefault()

    let priceValue = parseFloat($('#priceValue').val())
    let quantity = parseFloat($('#quantity').val())
    if(quantity > 1){
        priceValue -= parseFloat($('#priceHidden').val())
        quantity -= 1
    }

    $('#quantity').val(quantity)
    $('#priceValue').val(Number(priceValue.toFixed(2)))
    $('#total').html(quantity)
})