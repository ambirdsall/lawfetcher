export function handleAutoforwardPreference() {
  localStorage.getItem('autoforward', (err, value) => {
    if (err) {
      console.log(err)
    } else {
      // if there's a value, create a "remove autoforwarding" button, append it
      // to the DOM, and add an event handler which calls localStorage.removeItem()
      // the removeItem success callback should ice the button with a nice
      // jQuery fade out
      if (value) {
        $('.center-column')
          .append($('<button></button>')
                  .addClass('btn btn-danger center-block')
                  .attr('id', 'autoforward-remover')
                  .html('Remove Autoforwarding')
                  .click((e) => {
                    localStorage.removeItem('autoforward', (err) => {
                      if (err) {
                        console.log(err)
                      } else {
                        $('#autoforward-remover').removeClass('btn-danger').addClass('btn-success').fadeOut()
                      }
                    })
                  }))
      }
    }
  })
}
