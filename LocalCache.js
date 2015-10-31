var fs = require("fs-extra-promise")
var Promise = require("bluebird")

var Module = {};
var Storage = {}
var cacheLocation = "./";
var cacheName = "local.cache";
var cachePath = cacheLocation + cacheName;

function isCacheValid(creationTime,duration){
	var end = new Date();
	end.setHours(0,0,0,0);
	var now = end.getTime();
	if((now - creationTime) <= duration){
		return true
	}
	return false;
}

//duration is in second
function store(key,value,duration){
	// a day duration
	var key = key || "adzan"
	var duration = duration || (60*60*24)
	var createdTime = new Date();
	createdTime.setHours(0,0,0,0);
	Storage[key] = {
		data:value,
		duration:duration * 1000,
		createdTime:createdTime.getTime()
	}
	snapshotCache()
}

function get(key){
	var key = key || "adzan"
	return new Promise(function(resolve,reject){
		if (!fs.existsSync(cacheLocation)){
		    fs.mkdirSync(cacheLocation);
		}
		fs.readFile(cachePath,function(err,data){
			if(data){
				Storage = JSON.parse(data.toString());
			}
			var data = Storage[key];
			if(data){
				if(isCacheValid(data.createdTime,data.duration)){
					// data = JSON.parse(JSON.stringify(data.data))
				}else{
					data = ""
					Storage[key] = null
				}
				resolve(data)
			}
			if(!data){
				reject(false)
			}
		})
	})
}

function snapshotCache(){
	var content = JSON.stringify(Storage)
	fs.writeFile(cachePath,content,function(err){
		// console.log("Is error write local cache?", err)
	})
}

Module.store = store
Module.get = get

module.exports = Module