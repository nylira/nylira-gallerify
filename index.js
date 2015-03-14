#!/usr/bin/env node

(function(){
'use strict'

var path = require('path')
var fs = require('graceful-fs')
var wrench = require('wrench')
var util = require('util')
var glob = require('glob')

function isInt(n){
  return Number(n)===n && n%1===0
}

function isHeight(height) {
  return isInt(height) && height !== undefined
}

var userArgs = process.argv.splice(2)
var userDirectory = userArgs[0]
var userHeight = parseInt(userArgs[1],10)
userHeight = isHeight(userHeight) ? userHeight : 300

var galleryDirectory = './gallery-' + userDirectory
var galleryImagesDirectory = galleryDirectory + '/images'
var galleryIndexFile = galleryDirectory + '/index.html'

var images = []


function initializeGalleryDirectory(imagesDir) {
  wrench.mkdirSyncRecursive(galleryDirectory)
  wrench.copyDirSyncRecursive(userDirectory, galleryImagesDirectory, {
    forceDelete: true
  , excludeHiddenUnix: true
  , preserveFiles: false
  , preserveTimestamps: true
  , inflateSymlinks: true
  })
}

function getOnlyFilename(filepath) {
  var output = filepath.split('/')
  output = output[output.length - 1]
  return output
}

function mediaToHtml(media) {
  var extension = media.split('.')
  extension = extension[extension.length - 1]
  extension = extension.toLowerCase()
  //console.log(extension)
  var html = ''
  switch(extension) {
    case 'webm':
      html = '<video autoplay="autoplay" loop="loop" src="images/' + media + '"></video>'
      break;
    case 'gif':
      html = '<img src="images/' + media + '">'
      break;
    case 'png':
      html = '<img src="images/' + media + '">'
      break;
    case 'jpg':
      html = '<img src="images/' + media + '">'
      break;
    case 'jpeg':
      html = '<img src="images/' + media + '">'
      break;
    default:
      break;
  }
  return html
}

function createImages(files) {
  // for each file
  for(var i=0; i < files.length; i++) {

    // remove folder names
    files[i] = getOnlyFilename(files[i])

    // turn filename into html string
    images[i] = mediaToHtml(files[i])
  }

  //console.log(images)
}

function createHtmlFile(images) {
  var style = '<style>body{margin:0;}img, video {height: ' + userHeight + 'px; display: block;float: left;}</style>'
  var content = images.join('')
  var html = style + content
  fs.writeFileSync(galleryIndexFile, html, 'utf-8', function(err) {
    console.log('error!')
  })
}

function showify(imagesDir) {
  initializeGalleryDirectory(imagesDir)

  glob(galleryImagesDirectory + '/*', undefined, function(err, files) {
    createImages(files)
    createHtmlFile(images)

    console.log(images.length, 'images compiled into this gallery.')
    console.log('View', galleryIndexFile, 'in your browser!')
  })

}

showify(userDirectory)

}())
