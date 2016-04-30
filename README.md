# jsonToSchedule

This is static application for rendering light HTML schedule list by your json.

## Lisense

MIT. You can freely change codes or UI, or add some functions. Personal usage or commercial usage would not be related.

<!-- TODO: -->
DEMO is here.

## At first

- Only you have to do is download this repository and run `npm install`
- Then, you can freely add each of your schedules with `_js/schedule.json` file.

## schedule.json

`schedule.json` file contains the parameters as follows.

```
{
  "appTitle":        "",
  "googleMapAPIKey": "",
  "flickrAPIKey":    "",

  "schedules": [
    {
      "Title":       "",
      "Start":       "",
      "End":         "",
      "Description": "",
      "Where":       ""
    },
    {
      "Title":       "",
    ...
```

### appTitle

Optional. When you insert something like the title of your journey, then it would be appeared on `<title>` and the top of the page.

### googleMapAPIKey

<!-- TODO: -->
Optional. When you add your API key of Google Map, you can show Google Static Map on each schedules.

### flickrAPIKey

Optional. When you add your API key of Flickr, you can show one of Flickr image by `interestingness-desc` sorted.

### schedules

#### Title

*Mandatory.* Insert the name of building, event, whom you are going to meet, par se.

#### Start / End

*Both mandatory.* Insert the data and time of the event with the format `05/01/2016 12:00` or something (this string would be parsed.)

#### Description

Optional. When you have something to remember, insert text here.

#### Where

Optional. When you added the address like `11 W 53rd St, New York, NY 10019, USA` then Google Map and Route link activated.

## Please fix bugs.

I know this has some bugs. Please feel free to `pull request` to me.
