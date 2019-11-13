var express = require('express');
var router = express.Router();
const utils = require('../../module/utils/utils');
const resMessage = require('../../module/utils/responseMessage');
const statusCode = require('../../module/utils/statusCode');
const db = require('../../module/pool');
const authUtils = require('../../module/utils/authUtils');
const upload = require('../../config/multer');
const jwt = require('../../module/jwt');
const moment = require('moment')
/* 거래요청하기 */
router.post('/:item_idx', authUtils.isLoggedin, async (req, res) => {
    const userIdx = req.decoded.idx;
    const otherItemIdx = req.params.item_idx;
    const myItemIdx = JSON.parse(req.body.item_idx); // 문자열 배열로 주기 ex) [15, 16, 78]
    const date = moment().format("YYYY-MM-DD HH:mm:ss");
    if(myItemIdx.length > 3){   // 내 물건이 3개 초과일때 에러
        res.status(400).send(utils.successFalse(statusCode.BAD_REQUEST, resMessage.OVER_THREE_PRODUCT))
    }
    const exchangeAskQuery = `INSERT INTO trade (from_item_idx, to_item_idx, date, state) VALUE (?, ?, ?, ?)`;
    let exchangeAskResult
    for (i of myItemIdx){   // 한개씩 post
        exchangeAskResult = await db.queryParam_Parse(exchangeAskQuery, [i, otherItemIdx, date, 0]);
    }

    if (!exchangeAskResult) {   // 실패시 에러
        res.status(400).send(utils.successFalse(statusCode.BAD_REQUEST, resMessage.ASK_EXCHANGE_FAIL))
    } else {    // 성공시 출력
        res.status(200).send(utils.successTrue(statusCode.OK, resMessage.ASK_EXCHANGE_SUCCESS, `${myItemIdx}번 물품과 ${otherItemIdx}번물품 의 교환신청 성공`));
    }
});

module.exports = router;