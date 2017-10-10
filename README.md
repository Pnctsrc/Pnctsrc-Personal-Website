# Pnctsrc-Personal-Website

This is my personal page project using Meteor framework.

## Setup
1. Execute the following to install all the required NPM packages
    ```
    Meteor npm install --save
    ```
2. Set up Google Authentication - https://console.cloud.google.com/
3. In the project root, create a settings.json file containing the following: <br>
    {<br>
        "PNCTSRC_ACCESS_KEY": **\<Secret key used for adding/editing works/posts\>**<br>
        "IMAGE_PATH": **\<A folder path for uploaded images, must not be in the project folder\>**<br>
        "FILE_PATH": **\<A folder path for uploaded files, must not be in the project folder\>**<br>
        "ALLOWED_FILE_TYPE": **\<An array of allowed extensions for file upload, such as ["pdf", "zip"]\>**<br>
        "ALLOWED_IMAGE_TYPE": **\<An array of allowed extensions for image upload, such as ["jpg", "gif"]\>**<br>
        "GOOGLE_CLIENT_ID": **\<Google client id for authentication\>**<br>
        "GOOGLE_SECRET": **\<Google secret for authentication\>**<br>
    }
4. Set the site information - <br>
    while running the app, open a new terminal window in the project
    ```
    meteor mongo //connect to the databse
    meteor db.homepage.update({}, {$set:{
      name: <site name>,
      description: <description on the side bar>
      siteURL: <URL of the site>
      copyrightYear: <copyright year>
    }})
    ```

## Running
    Meteor --settings settings.json
    
## Usage
- Post
  - New post: **\<siteURL\>/post_new**
  - Edit post:  **\<siteURL\>/posts/view/\<URL encoded post title\>/edit**
- Work:
  - New work: **\<siteURL\>/work_new**
  - Edit work:  **\<siteURL\>/works/view/\<URL encoded work title\>/edit**
- Edit about page: **\<siteURL\>/about/edit**
    
## Built with
* [Meteor](https://www.meteor.com/)
* [Semantic UI](https://semantic-ui.com/)
* [Hilightjs](https://highlightjs.org/)
* [Quill](https://quilljs.com/)
* [Summernote](http://summernote.org/)
* [Wait-on-lib](https://atmospherejs.com/manuelschoebel/wait-on-lib)
* [Collection2](https://atmospherejs.com/aldeed/collection2)
* [Iron:router](https://github.com/iron-meteor/iron-router)
* [JS Beautifier](http://jsbeautifier.org/)
* [Bootstrap Affix](https://getbootstrap.com/docs/3.3/javascript/#affix)
* [Bootstrap Scrollspy](https://getbootstrap.com/docs/3.3/javascript/#scrollspy)

## License

This project is licensed under [MIT License](LICENSE.md).
