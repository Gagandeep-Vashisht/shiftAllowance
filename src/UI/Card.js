import classes from "./Card.module.css";

const Card = (props) => {
  return (
    <div className={classes.card}>
      <h2> Assetmark- Shift Allowance</h2>
      {props.children}
    </div>
  );
};

export default Card;
