/*function convertPrice(filename) {
  var reader = new FileReader();
    console.log(filename);
  reader.onLoad = function(e)
  {
    var fileObject = e.target.files[0];
    console.log(filename);
    console.log(fileObject);
    reader.readAsText(filename);
  }

  return reader.result;


}*/

function readTextFile(file)
{
    var rawFile = new XMLHttpRequest();
    rawFile.open("GET", file, false);
    rawFile.onreadystatechange = function ()
    {
        if(rawFile.readyState === 4)
        {
            if(rawFile.status === 200 || rawFile.status == 0)
            {
                var allText = rawFile.responseText;
                alert(allText);
            }
        }
    }
    rawFile.send(null);
}
