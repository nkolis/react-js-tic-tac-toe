/* eslint-disable react/prop-types */
export default function XShape({ style = {} }) {
  return (
    <>
      <div style={style} className={`shape-x scale-shape-x`}>
        <span style={style}></span>
        <span style={style}></span>
      </div>
    </>
  );
}
