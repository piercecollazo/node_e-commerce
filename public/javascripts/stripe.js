$(()=>{
    Stripe.setPublishableKey('pk_test_c1imaNeBlMF6EcsiWPZhuA4s00boeoW4Pg')

    function stripeResponseHandler(status, response){
        let $form = $('#payment-form')

        if(response.error){
            console.log(`Stripe error: ${response.error.message}`)

            debugger
            $form.find('.payment-errors').text(response.error.message)
            $('#cardSubmit').prop('disabled', true)
        } else {
            let token = response.id

            $form.append($('<input type="hidden" name="stripeToken" />').val(token))

            $form.get(0).submit()
        }
    }

    $('#payment-form').submit((event)=>{
        let cardNumber = $('#cardNumber').val()
        let cvcCode = $('#cvc-code').val()
        let expMonth = $('#card-expiry-month-year').val().slice(0,2)
        let expYear = $('#card-expiry-month-year').val().slice(2,4)


        $('#cardSubmit').prop('disabled', true)

        Stripe.card.createToken({
            number: cardNumber,
            cvc: cvcCode,
            exp_month: expMonth,
            exp_year: expYear
        }, stripeResponseHandler)

        return false
    })
})