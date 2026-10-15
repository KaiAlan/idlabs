/* Figma 26-5984 — local assets, plain CSS. */
const imgVector = "/assets/26-5984-imgVector.svg";
const imgVector1 = "/assets/26-5984-imgVector1.svg";
const imgVector2 = "/assets/26-5984-imgVector2.svg";
const imgVector3 = "/assets/26-5984-imgVector3.svg";
const imgVector4 = "/assets/26-5984-imgVector4.svg";
const imgVector5 = "/assets/26-5984-imgVector5.svg";

export default function Design26_5984() {
  return (
    <div className="d26_5984_1" data-node-id="26:5984" data-name="Figure">
      <div className="d26_5984_2" data-node-id="26:5985" data-name="Container">
        <div className="d26_5984_3">
          <div className="d26_5984_4" data-node-id="26:5986" data-name="Image - LinkedIn ranking signal weights; dominant signal highlighted">
            <p className="d26_5984_5" data-node-id="26:5987">
              (b) LinkedIn
            </p>
            <div className="d26_5984_6" data-node-id="26:5988" data-name="Group">
              <p className="d26_5984_7" data-node-id="26:5989">
                Dwell time
              </p>
              <p className="d26_5984_8" data-node-id="26:5990">
                w = .40
              </p>
            </div>
            <div className="d26_5984_9" data-node-id="26:5991" data-name="Group">
              <div className="d26_5984_10" data-node-id="26:5992" data-name="Vector">
                <div className="d26_5984_11">
                  <img alt="" className="d26_5984_12" src={imgVector}  decoding="async" draggable={false} />
                </div>
              </div>
              <p className="d26_5984_13" data-node-id="26:5993">
                Prof. relevance
              </p>
              <p className="d26_5984_14" data-node-id="26:5994">
                w = .30
              </p>
            </div>
            <div className="d26_5984_15" data-node-id="26:5995" data-name="Group">
              <div className="d26_5984_16" data-node-id="26:5996" data-name="Vector">
                <div className="d26_5984_17">
                  <img alt="" className="d26_5984_18" src={imgVector1}  decoding="async" draggable={false} />
                </div>
              </div>
              <p className="d26_5984_19" data-node-id="26:5997">
                Early comments
              </p>
              <p className="d26_5984_20" data-node-id="26:5998">
                w = .20
              </p>
            </div>
            <div className="d26_5984_21" data-node-id="26:5999" data-name="Group">
              <div className="d26_5984_22" data-node-id="26:6000" data-name="Vector">
                <div className="d26_5984_23">
                  <img alt="" className="d26_5984_24" src={imgVector2}  decoding="async" draggable={false} />
                </div>
              </div>
              <p className="d26_5984_25" data-node-id="26:6001">
                Connection proximity
              </p>
              <p className="d26_5984_26" data-node-id="26:6002">
                w = .10
              </p>
            </div>
            <div className="d26_5984_27" data-node-id="26:6003" data-name="Vector">
              <div className="d26_5984_28">
                <img alt="" className="d26_5984_29" src={imgVector3}  decoding="async" draggable={false} />
              </div>
            </div>
            <div className="d26_5984_30" data-node-id="26:6004">
              <div className="d26_5984_31" data-node-id="26:6005" data-name="Vector">
                <div className="d26_5984_32">
                  <img alt="" className="d26_5984_33" src={imgVector4}  decoding="async" draggable={false} />
                </div>
              </div>
              <div className="d26_5984_34" data-node-id="26:6006" data-name="Vector">
                <div className="d26_5984_35">
                  <img alt="" className="d26_5984_36" src={imgVector5}  decoding="async" draggable={false} />
                </div>
              </div>
              <p className="d26_5984_37" data-node-id="26:6007">
                rank
              </p>
            </div>
            <p className="d26_5984_38" data-node-id="26:6008" style={{ fontVariationSettings: '"CTGR" 0, "wdth" 100' }}>
              ☰
            </p>
            <p className="d26_5984_39" data-node-id="26:6009">
              feed
            </p>
          </div>
        </div>
      </div>
      <div className="d26_5984_40" data-node-id="26:6010" data-name="Figcaption">
        <div className="d26_5984_41">
          <p className="d26_5984_42" data-node-id="26:6011" style={{ fontVariationSettings: '"CTGR" 0, "wdth" 100' }}>
            <span className="d26_5984_43" style={{ fontVariationSettings: '"CTGR" 0, "wdth" 100' }}>{`ribbon width ∝ signal weight · `}</span>
            <span className="d26_5984_44" style={{ fontVariationSettings: '"CTGR" 0, "wdth" 100' }}>
              red = dominant signal
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
