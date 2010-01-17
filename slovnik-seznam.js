CmdUtils.CreateCommand({
  names: ["dict"],  
  description: "Search a given word in dictionary http://slovnik.seznam.cz",
  help: "word [from language (default English)] [to language(default Czech)] <br /><br /> <b>Supported language</b>:<br/>Czech|English |Spanish|German|Russian|French|Italian. The source or the target language has to be Czech.<br /><br /> <b>Example</b>:<br />dict hello from english",
  author: {name: "Roman Pichlik", email: "pichlik@seznam.cz"},
  license: "Apache 2.0 License",
  homepage: "http://sweb.cz/pichlik",
  arguments: [{role: 'theWord', nountype: noun_arb_text, label: 'word|phrase'}, {role: 'source', nountype: noun_type_language},  {role: 'goal', nountype: noun_type_language} ],  
  preview: function preview(pblock, args) {     
    var baseUrl = "http://slovnik.seznam.cz/";
    var fromLanguage =  getLanguageCode(args["source"], "en"); 
    var toLanguage = getLanguageCode(args["goal"], "cz"); 

    if(fromLanguage == toLanguage) {
      pblock.innerHTML =  args.theWord.text;
    } else {
      var params = {q: args.theWord.text, lang: fromLanguage + "_" + toLanguage};
      jQuery.get( baseUrl, params, function( result ) {
         var wordTableRows = jQuery(result).find("table#words").find("tr");      
         var collocationsList = jQuery(result).find("div#collocations").find("dl");
         pblock.innerHTML =  processWords(wordTableRows) + processCollocations(collocationsList);   
      });
    }     
    
  },
  execute: function execute(args) {
  }
});

function getLanguageCode(lang, defaultLang) {
  var _lang = lang.text.toLowerCase();
  switch(_lang) {
       case "german":
         return "de"; 
       case "english":
         return "en";       
       case "french":
         return "fr";
       case "italian":
         return "it";
       case "spanish":
         return "es";
       case "russian":
         return "ru";
       case "czech":
         return "cz";
       default:
         return defaultLang;
  }
}


function processCollocations(collocationsList) {
  if(collocationsList.length == 0) {
    return ""; 
  }
  _r = "<p><b>Slovni spojeni</b></p>" 
  var terms = jQuery(collocationsList).find("dt");
  var definitions = jQuery(collocationsList).find("dd");
  _r += "<ul>";
  for(i = 0; i < terms.length; i++) {
      _r += "<li>";
      _r += jQuery(jQuery(terms[i]).find("a")[0]).text();     
      _r += " - ";
      
      foundDefinitions = jQuery(definitions[i]).find("a");
      
      for(j = 0; j < foundDefinitions.length; j ++) {
         _r += jQuery(foundDefinitions[j]).text();
         if(j+1 < foundDefinitions.length) {
           _r += ", ";  
         }
      } 
      _r += "</li>";
  }
  _r += "</ul>";
  return _r;
}

function processWords(wordsTable) {
  if(wordsTable.length == 0) {
    return ""; 
  }

  var _r = "<p>";    
  for(i = 0; i < wordsTable.length; i++) {
    _r += "<ul><li>"

    var searchedOrSimilarWord = jQuery(wordsTable[i]).find("td.word").find("a");
    for(k = 0; k < searchedOrSimilarWord.length; k++) {
       _r += "<b>" + jQuery(searchedOrSimilarWord[k]).text() + "</b>";
    }     

    var translatedWords = jQuery(wordsTable[i]).find("td.translated").find("a");
    _r += "<ul>";
    for(j = 0; j < translatedWords.length; j++) {
      _r +=  "<li>" + jQuery(translatedWords[j]).text() + "</li>";
    }  
    _r += "</ul>";
    
    _r += "</li></ul>";
  }      
  _r += "</p>"; 
  return _r;
}
