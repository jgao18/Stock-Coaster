function getDateAndPriceListFromFile(filepath)
{
  dateAndPriceList = [];
  dateList = [];
  priceList = [];

  file = new XMLHttpRequest();
  file.open("GET", filepath, false);
  file.onreadystatechange = function ()
  {
    if (file.readyState === 4)
    {
      if (file.status === 200 || file.status == 0)
      {
        allText = file.responseText;
        datesAndPricesText = allText.split(/\r?\n/);
        for (i = 0; i < datesAndPricesText.length; i++)
        {
          datePriceRegex = datesAndPricesText[i].split(/(\s+)/);

          dateList.push(datePriceRegex[0]);

          rawPrice = datePriceRegex[2];
          price = Math.round(rawPrice * 100) / 100;
          priceList.push(price);
        }
      }
    }
  }
  file.send(null);
  dateAndPriceList.push(dateList, priceList);
  return dateAndPriceList;

}
