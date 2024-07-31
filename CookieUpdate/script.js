//#region - PARAMETER -
// 根據 UserDataHandler 設定
var cookieKey = "UserData";
var DayToLive = 3;

var collectionKey = "collection";
var collectionValue = ["a", "b", "c", "d", "e"];

var prizeKey = "prize";
var prizeValue = ["normal"];

// 集章網址
var WebsiteURL = "https://reno30119.github.io/TestPoint/";
//#endregion

//#region - USER DATA -
// 根據 UserDataHandler 設定
var UserStatus = {
    FirstVisit: 0, //首次進入
    Collect: 1, // 集章
    Exchange: 2 // 兌換
}
var UserData = {
    status: UserStatus.FirstVisit,
    collections: new Array(collectionValue.length).fill(false),
    newCollectIndex: -1,
    prizes: new Array(prizeValue.length).fill(false),
    newExchangeIndex: -1,
}
//#endregion

// 獲取Cookie
var data = GetCookie(cookieKey);
console.log("data => " + DataToString(data));

// 更新集章資料
var collectionParameter = GetURLParameter(collectionKey);
for (var i = 0; i < collectionValue.length; i++) {
    if (collectionParameter == collectionValue[i]) {
        if (!data.collections[i]) {
            data.newCollectIndex = i;
            data.collections[i] = true;
        }
        break;
    }
}

// 如果使用者狀態為兌換，更新兌換資料
if (data.status == UserStatus.Exchange) {
    var prizeParameter = GetURLParameter(prizeKey);
    for (var i = 0; i < prizeValue.length; i++) {
        if (prizeParameter == prizeValue[i]) {
            if (!data.prizes[i]) {
                data.newExchangeIndex = i;
                data.prizes[i] = true;
            }            
            break;
        }
    }
}
console.log("updated data => " + DataToString(data));

// 寫入Cookie
var dataString = JSON.stringify(data);
console.log("updated cookie => " + dataString);
SetCookie(cookieKey, dataString);

// 前往活動網頁
window.location.replace(WebsiteURL);


//#region - 獲取COOKIE -
function GetCookie(key) {
    // 先獲取一個初始設定的使用者資料
    var data = UserData;
    // 獲取網頁Cookie
    var decodedCookie = decodeURIComponent(document.cookie);
    console.log("Cookie => " + decodedCookie);

    // 分解Cookie
    var cookies = decodedCookie.split('; ');
    // 查找Cookie
    for (var i = 0; i < cookies.length; i++) {
        // 將索引與值分開
        var cookie = cookies[i].split("=");
        // 如果索引 = cookie key，且值不為空
        if (cookie[0] = key && cookie[1] != null) {
            // Json 解析
            var cookieData = JSON.parse(cookie[1]);
            
            // 將cookie值載入data
            data.status = cookieData.status;
            for (var i = 0; i < data.collections.length; i++){
                data.collections[i] = cookieData.collections[i];
            }
            for (var i = 0; i < data.prizes.length; i++) {
                data.prizes[i] = cookieData.prizes[i];
            }
        }
    }
    return data;
}
//#endregion

//#region - 獲取網址參數 - 
function GetURLParameter(key) {
    // 獲取網址
    var url = document.URL;
    // 確認網址是否帶有參數
    var index = url.indexOf("?");
    if (index != -1) {
        // 獲取網址參數
        var decodedParameter = url.split("?")[1];
        // 分解參數
        var parameters = decodedParameter.split("&");
        // 查找參數
        for (var i = 0; i < parameters.length; i++) {
            // 將索引與值分開
            var parameter = parameters[i].split("=");
            if (parameter[0] = key) {
                return parameter[1];
            }
        }
    }
    return "Null";
}
//#endregion

//#region - 寫入COOKIE - 
function SetCookie(key, value) {
    var cookie = key + "=" + value;
    // 設定Cookie保留時間
    var date = new Date();
    date.setTime(date.getTime() + (DayToLive * 24 * 60 * 60 * 1000));
    var expires = "expires=" + date.toUTCString();
    document.cookie = cookie + "; " + expires + "; path=/";
}
//#endregion

//#region - DEBUG -
function DataToString(data)
{
    var str ="{\n"+
            "status: " + data.status + "\n" +
            "collection: " + data.collections + "\n" +
            "newCollectIndex: " + data.newCollectIndex + "\n" +
            "prize: " + data.prizes + "\n" +
            "newExchangeIndex: " + data.newExchangeIndex + "\n"+
            "}";
    return str;
}
//#endregion
