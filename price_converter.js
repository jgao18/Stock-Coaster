function getPriceListFromFile(filepath)
{
  var priceList = [];

  var file = new XMLHttpRequest();
  file.open("GET", filepath, false);
  file.onreadystatechange = function ()
  {
      if(file.readyState === 4)
      {
          if(file.status === 200 || file.status == 0)
          {
              var allText = file.responseText;
              var dateAndPriceList = allText.split(/\r?\n/);
              for (i = 0; i < dateAndPriceList.length; i++)
              {
                rawPrice = dateAndPriceList[i].split(/(\s+)/)[2];
                price = Math.round(rawPrice * 100) / 100;
                priceList.push(price);
              }
          }
      }
  }
  file.send(null);
  return priceList;

}
