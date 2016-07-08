var siteDataArray;

var getAllTagsFromSiteData= function() {
  var result = _.reduce(siteDataArray, function(result, siteData) {
                                  if(siteData.tags) {
                                    var tags = (typeof siteData.tags == "string" )?
                                              siteData.tags.split(",") :
                                              siteData.tags;
                                    result = result.concat(tags);
                                  }
                                  return result;
                                }, []);

    //Trim
    result = _.map(result, function(value) {
      return _.trim(value);
    });

    return _.uniq(result);
};

var buildLinks = function(linksData, siteCardElement) {
  for(var i=0; i<linksData.length;i++) {
    $('#links', siteCardElement).empty();
    $('#links', siteCardElement).append("<li><a href='"+linksData[i]+"'>"+linksData[i]+"</a></li>");
  }
};

var buildSiteCardElement = function(siteData) {
    var sitecardHtml = $('#site-card').text();
    var siteCardElement = $(sitecardHtml);
    $('#title', siteCardElement).html("<a href='src/"+siteData.folder+"' target='_blank'>"+siteData.title+"</a>");
    $('#description', siteCardElement).html(siteData.description);
    buildLinks(siteData.links , siteCardElement);
    return siteCardElement[0];
};

var showSitesByTag = function(tag, target) {

  $('nav ul a').removeClass('selected');
  $(target).addClass('selected');

  $('.sitelist').empty();

  console.log("showSitesByTag tag" , tag);

  //TODO filter samples by tag
  var filteredResults = _.filter(siteDataArray, function(siteData) {
    return siteData.tags.indexOf(tag) !== -1;
  });

  //loop result and added to central list with cool transitions
  // debugger;

  var resultObjs = [];
  var aux;
  for(var i=0;i<filteredResults.length;i++) {
    aux = buildSiteCardElement(filteredResults[i]);
    console.log("showSitesByTag aux" , aux);

    resultObjs[i] = aux;
  }


// debugger;
  for(var i=0;i<resultObjs.length;i++) {
    $('.sitelist').append(resultObjs[i]);
  }

  setTimeout(function() {
    $('.sample-card').addClass('show');
  } , 10);

};

//read catalog.json
$.ajax({
  method: "GET",
  url: "catalog.json",
  dataType: "json"
}).done(function(data) {
  siteDataArray=data;
  console.log("siteDataArray-->" , siteDataArray);

  //append all tags as left menu options
  var getAllTags = getAllTagsFromSiteData();
  console.log("getAllTags -->" , getAllTags);
  var leftMenuDomObj = $('nav ul');
  leftMenuDomObj.empty();
  _.forEach(getAllTags , function(tag) {
    leftMenuDomObj.append('<li><a href="#" onclick="showSitesByTag(\''+tag+'\', this)">'+tag+'</a></li>');
  });

  $('.overlay').hide();
});
