# lauf-app
Running tracking app


location: https://www.youtube.com/watch?v=UcWG2o2gVzw
https://blog.expo.io/a-complete-guide-to-recording-location-data-in-react-native-9ee6e1ef7893

Distance calculation with HAVERSINE:
https://www.npmjs.com/package/haversine


*Update position with EXPO:*
watchPositionAsync

*UpdatePosition with Native:*
navigator.geolocation.watchPosition

location.coords.speed — meters per second

pace (min/km) = 
speed (km/h) = floor(1000 / coords.speed) + speed % 60
