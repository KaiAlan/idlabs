/* Figma 26-6428 — local assets, plain CSS. */
const imgVector = "/assets/26-6428-imgVector.svg";
const imgVector1 = "/assets/26-6428-imgVector1.svg";
const imgVector2 = "/assets/26-6428-imgVector2.svg";
const imgVector3 = "/assets/26-6428-imgVector3.svg";

export default function Design26_6428() {
  return (
    <div className="d26_6428_1" data-node-id="26:6428" style={{ containerType: "size" }} data-name="Golden spiral">
      <div className="d26_6428_2" data-node-id="26:6429" data-name="Vector">
        <div className="d26_6428_3">
          <img alt="" className="d26_6428_4" src={imgVector}  decoding="async" draggable={false} />
        </div>
      </div>
      <div className="d26_6428_5" data-node-id="26:6430" data-name="Vector">
        <div className="d26_6428_6">
          <img alt="" className="d26_6428_7" src={imgVector1}  decoding="async" draggable={false} />
        </div>
      </div>
      <div className="d26_6428_8" data-node-id="26:6431" data-name="Vector">
        <div className="d26_6428_9">
          <img alt="" className="d26_6428_10" src={imgVector2}  decoding="async" draggable={false} />
        </div>
      </div>
      <div className="d26_6428_11" data-node-id="26:6432" data-name="Vector">
        <img alt="" className="d26_6428_12" src={imgVector3}  decoding="async" draggable={false} />
      </div>
      <div className="d26_6428_13" data-node-id="26:6433">
        <div className="d26_6428_14">
          <div className="d26_6428_15">
            <p className="d26_6428_16">
              <span className="d26_6428_17">{`T `}</span>
              <span className="d26_6428_18">he world’s first</span>
            </p>
            <p className="d26_6428_19">
              <span className="d26_6428_20">content science</span>
              <span className="d26_6428_21">{` lab.`}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
