/* Figma 26-5956 — local assets, plain CSS. */
const imgVector = "/assets/26-5956-imgVector.svg";
const imgVector1 = "/assets/26-5956-imgVector1.svg";
const imgVector2 = "/assets/26-5956-imgVector2.svg";
const imgVector3 = "/assets/26-5956-imgVector3.svg";
const imgVector4 = "/assets/26-5956-imgVector4.svg";
const imgVector5 = "/assets/26-5956-imgVector5.svg";

export default function Design26_5956() {
  return (
    <div className="d26_5956_1" data-node-id="26:5956" data-name="Figure">
      <div className="d26_5956_2" data-node-id="26:5957" data-name="Container">
        <div className="d26_5956_3">
          <div className="d26_5956_4" data-node-id="26:5958" data-name="Image - X ranking signal weights; dominant signal highlighted">
            <p className="d26_5956_5" data-node-id="26:5959">
              (a) X
            </p>
            <div className="d26_5956_6" data-node-id="26:5960" data-name="Group">
              <p className="d26_5956_7" data-node-id="26:5961">
                Early velocity
              </p>
              <p className="d26_5956_8" data-node-id="26:5962">
                w = .35
              </p>
            </div>
            <div className="d26_5956_9" data-node-id="26:5963" data-name="Group">
              <div className="d26_5956_10" data-node-id="26:5964" data-name="Vector">
                <div className="d26_5956_11">
                  <img alt="" className="d26_5956_12" src={imgVector}  decoding="async" draggable={false} />
                </div>
              </div>
              <p className="d26_5956_13" data-node-id="26:5965">
                Repost graph
              </p>
              <p className="d26_5956_14" data-node-id="26:5966">
                w = .30
              </p>
            </div>
            <div className="d26_5956_15" data-node-id="26:5967" data-name="Group">
              <div className="d26_5956_16" data-node-id="26:5968" data-name="Vector">
                <div className="d26_5956_17">
                  <img alt="" className="d26_5956_18" src={imgVector1}  decoding="async" draggable={false} />
                </div>
              </div>
              <p className="d26_5956_19" data-node-id="26:5969">
                Reply density
              </p>
              <p className="d26_5956_20" data-node-id="26:5970">
                w = .20
              </p>
            </div>
            <div className="d26_5956_21" data-node-id="26:5971" data-name="Group">
              <div className="d26_5956_22" data-node-id="26:5972" data-name="Vector">
                <div className="d26_5956_23">
                  <img alt="" className="d26_5956_24" src={imgVector2}  decoding="async" draggable={false} />
                </div>
              </div>
              <p className="d26_5956_25" data-node-id="26:5973">
                Hook CTR
              </p>
              <p className="d26_5956_26" data-node-id="26:5974">
                w = .15
              </p>
            </div>
            <div className="d26_5956_27" data-node-id="26:5975" data-name="Vector">
              <div className="d26_5956_28">
                <img alt="" className="d26_5956_29" src={imgVector3}  decoding="async" draggable={false} />
              </div>
            </div>
            <div className="d26_5956_30" data-node-id="26:5976">
              <div className="d26_5956_31" data-node-id="26:5977" data-name="Vector">
                <div className="d26_5956_32">
                  <img alt="" className="d26_5956_33" src={imgVector4}  decoding="async" draggable={false} />
                </div>
              </div>
              <div className="d26_5956_34" data-node-id="26:5978" data-name="Vector">
                <div className="d26_5956_35">
                  <img alt="" className="d26_5956_36" src={imgVector5}  decoding="async" draggable={false} />
                </div>
              </div>
              <p className="d26_5956_37" data-node-id="26:5979">
                rank
              </p>
            </div>
            <p className="d26_5956_38" data-node-id="26:5980" style={{ fontVariationSettings: '"CTGR" 0, "wdth" 100' }}>
              ☰
            </p>
            <p className="d26_5956_39" data-node-id="26:5981">
              feed
            </p>
          </div>
        </div>
      </div>
      <div className="d26_5956_40" data-node-id="26:5982" data-name="Figcaption">
        <div className="d26_5956_41">
          <p className="d26_5956_42" data-node-id="26:5983" style={{ fontVariationSettings: '"CTGR" 0, "wdth" 100' }}>
            <span className="d26_5956_43" style={{ fontVariationSettings: '"CTGR" 0, "wdth" 100' }}>{`ribbon width ∝ signal weight · `}</span>
            <span className="d26_5956_44" style={{ fontVariationSettings: '"CTGR" 0, "wdth" 100' }}>
              red = dominant signal
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
