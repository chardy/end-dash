$(document).ready(function() {

  // https://github.com/ghiculescu/jekyll-table-of-contents
  var no_back_to_top_links = false

  var headers = $('h1, h2, h3, h4, h5, h6').filter(function() {return this.id}), // get all headers with an ID
      output = $('.toc');
  if (!headers.length || headers.length < 3 || !output.length)
    return;

  var get_level = function(ele) { return parseInt(ele.nodeName.replace("H", ""), 10) }
  var highest_level = headers.map(function(_, ele) { return get_level(ele) }).get().sort()[0]
  var return_to_top = '<i class="icon-arrow-up back-to-top"> </i>'

  var level = get_level(headers[0]), this_level, html = "<ul class='nav'>";
  headers.on('click', function() {
    if (!no_back_to_top_links) window.location.hash = this.id
  }).addClass('clickable-header').each(function(_, header) {
    this_level = get_level(header);
    if (!no_back_to_top_links && this_level === highest_level) {
      $(header).addClass('top-level-header').after(return_to_top)
    }
    if (this_level === level) // same level as before; same indenting
      html += "<li><a href='#" + header.id + "'>" + header.innerHTML + "</a>";
    else if (this_level < level) // higher level than before; end parent ol
      html += "</li></ul></li><li><a href='#" + header.id + "'>" + header.innerHTML + "</a>";
    else if (this_level > level) // lower level than before; expand the previous to contain a ol
      html += "<ul class='nav'><li><a href='#" + header.id + "'>" + header.innerHTML + "</a>";
    level = this_level; // update for the next one
  });
  html += "</ul>";
  if (!no_back_to_top_links) {
    $(document).on('click', '.back-to-top', function() {
      $(window).scrollTop(0);
      window.location.hash = '';
    })
  }
  output.hide().html(html).show('slow');

  //interactive template example
  EndDash.bootstrap();
  var render = function(){
    try {
      var modelText = $('#model-edit').text(),
          templateText = $('#template-edit').text();
      EndDash.registerTemplate('custom', templateText);

      var template = EndDash.getTemplate('custom', eval(modelText));
      $('#user-edit').html(template.el);
    }
    catch(error) {
       console.log("Error occurred:", error)
    }
  };
  render();
  $('#model-edit').on('change keyup keydown', render);
  $('#template-edit').on('change keyup keydown', render);

  //interactive inputs example
  // Load all the templates on the page.

  $('#rawDocs').find('h1').each(function(x, el){
    name = $(el).text()
    $(el).prepend('<span class="hasFirstName-">So, <span class="firstName-"></span>,\
    this is the section about </span>');
  });
  liveDocs = $('#rawDocs').html();
  $('#rawDocs').empty();
  EndDash.registerTemplate('liveDocs', "<div>" + liveDocs + "</div>");

  var user = new Backbone.Model({
    name: '',
  });

  user.on('change:name', function(evt){
    if (this.get('name').match(/<.*>/))
    {
      $('#easterEgg').attr('id', 'nice');
      $('.niceSpeech').css({
        "opacity": 1
      })
      this.set('name', 'Sir/Madam Hacker');
    }
    this.set('firstName', this.get('name').split(' ')[0]);
    that = this;
    if (that.get('name')){
      text = ("So, " + that.get("firstName") + ", this is the section about Examples");
      $('#toc_35').text(text);
    } else {
      $('#toc_35').text("Examples");
    }
  })

  var extremeCharacter = new Backbone.Model({
    name: 'Tony'
  });

  var docs      = EndDash.getTemplate('liveDocs', user),
      template  = EndDash.getTemplate('inputName', user),
      template2 = EndDash.getTemplate('whichCharacter', extremeCharacter);

  $('#liveDocs').html(docs.el);
  $('#inputs').html(template.el);
  $('#inputs2').html(template2.el);

  $('.container').find('a').addClass('hidden');
  $("a:contains('dependency')").removeClass('hidden')
    .attr('href', $("a:contains('Dependencies')").attr('href'));
  $("a:contains('Documentation')").removeClass('hidden')
    .attr('href', $("a:contains('Documentation')").attr('href'));
  $("p:contains('*')").addClass('hidden');
  $("p:contains('note')").addClass('note');
  $("p:contains('WARNING')").addClass('warning');


  var examplesDiv = $('a[href$="#toc_35"]').parent();
  examples = examplesDiv.detach();
  $('.toc').first('div.toc').children('ul').append(examples);
});

var w = $(window)

w.scroll(

    function(){

        var footer = $("footer").offset().top,
            inner = $(window).innerHeight(),
            scrollTop = $(window).scrollTop(),
            navSwap  = footer - inner,
            cssBottom = scrollTop - navSwap,
            button = $("a.jobs"),
            jobs = $(".jobs p").parent(),
            tOffset = button.offset().top,
            jOffset = jobs.height(),
            container = $(".container"),
            width = container.outerWidth(),
            buttonHeight = button.height(),
            fold = $(".endDashFold")

        if (w.scrollTop()<w.height()){
          $(".active").removeClass("active")
        }

        if (navSwap <= scrollTop) {
            $("nav").css({
                "bottom": cssBottom,
                "transition": "all 0s linear"
            })
        } else {
            $("nav").css({
                "bottom": 0
            })
        }

      if (w.scrollTop()>tOffset){
        button.css({
          "position":"fixed",
          "top":0,
          "width":width,
          "transition":"none"
        }),
        fold.css({
          "margin-top":buttonHeight+40,
          "transition":"none"
        })
      } else if (w.scrollTop() < jOffset+60) {
          button.css({
            "position":"relative",
            "top":"auto"
          }),
          fold.css({
            "margin-top":0
          })
        }
}

)




w.ready(
  function() {

    $(".endDashFold #inputs div p input").focus();

    $('body').scrollspy({ target: '#scrollSpyTarget' })

    // $(".endDashFold").css({
    //     "min-height": $(window).innerHeight()
    // })
})

w.ready(
    function landingPageInputFocus () {
      $(".endDashFold #inputs div p input").focus();
})

w.ready(
  function(){
    exampleSetup = function(evt){
    $target = $('#exampleInput')
    if (!$target.val()){
      $target.val('Tony Stark');
      $target.trigger('change');
    }
  }
  setTimeout(function(){
    $('#exampleInput').one('blur', exampleSetup);
    $(window).one('scroll', exampleSetup);

    },0);
  })



