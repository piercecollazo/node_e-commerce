
$('#testButton').click(()=>{
    $.ajax({
        method: 'POST',
        url: '/testJquery',
        data: {
            connectionCheck: 'test string'
        },
        dataType: 'json',
        success: (response)=> {
            console.log('response: ', response)

            $('#container').append(`<h3>${response.result}</h3>`)
        },
        error: ()=>{
    
        }
    })
})
