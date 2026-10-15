/* Figma 26-2432 — local assets, plain CSS. */
const imgImage630 = "/assets/26-1160-img.png";
const imgIcon = "/assets/26-2432-imgIcon.svg";

export default function Design26_2432() {
  return (
    <div className="d26_2432_1" data-node-id="26:2432" data-name=".">
      <div className="d26_2432_2" data-node-id="26:2434">
        <div className="d26_2432_3">
          <div className="d26_2432_4" data-name="image 630">
            <img alt="" className="d26_2432_5" src={imgImage630}  decoding="async" draggable={false} />
          </div>
        </div>
      </div>
      <div className="d26_2432_6" data-node-id="26:2435" data-name="Container">
        <div className="d26_2432_7" data-node-id="26:2436" data-name="Icon">
          <img alt="" className="d26_2432_8" src={imgIcon}  decoding="async" draggable={false} />
        </div>
        <div className="d26_2432_9" data-node-id="26:2447">
          <p className="d26_2432_10">
            <span className="d26_2432_11">{`T `}</span>
            <span className="d26_2432_12">he world’s first</span>
          </p>
          <p className="d26_2432_13">
            <span className="d26_2432_14">content science</span>
            <span className="d26_2432_15">{` lab.`}</span>
          </p>
        </div>
      </div>
    </div>
  );
}
