# through2-map-promise
A small promise-based wrapper for through2. Allows you to easily map over data in a stream while using promises for flow control.

## Quickstart

```
npm install --save through2-map-promise
```

```javascript
var map = require("through2-map-promise");
var xtend = require("xtend");

// in an HTTP request handler
db.users.find({}).pipe(map(function(user){
    var locationId = user.location;
    return db.locations.findOne({_id: locationId}).then(function(location){
        return xtend(user, {
            location: location
        });
    });
})).pipe(response);
```

## API
### `through2-map-promise([options,] [fn])`
Creates a transform stream which calls your transforming function, `fn`. You can throw within your function to automatically reject the promise and error-out the stream. `options` is the optional object that gets passed into [through2](https://github.com/rvagg/through2#options).

### `through2-map-promise.obj([options,] [fn])`
Same as the former, but the stream is created in objectMode

### `through2-map-promise.ctor([options,] [fn])`
Creates a constructor for your transform stream in case you want to be more efficient
