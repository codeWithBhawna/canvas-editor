const elements = [
    { type: "image", label: "Image", icon: "/image-icon.png" },
    { type: "button", label: "Button", icon: "/button-icon.png" },
    { type: "text", label: "Text", icon: "./images/text-icon.png" },
    { type: "icon", label: "Icon", icon: "/icon-icon.png" },
    { type: "oval", label: "Oval", icon: "/oval-icon.png" },
    { type: "rectangle", label: "Rectangle", icon: "/rectangle-icon.png" },
    { type: "circle", label: "Circle", icon: "/circle-icon.png" }, 
  ];
  
  const Elements = ({ handleDragStart }) => {
    return (
      <div className="elements-container">
        {elements.map((element, index) => (
          <div
            key={index}
            draggable
            onDragStart={(e) => handleDragStart(e, element.type)}
            className="element-item"
          >
            <img src={element.icon}  />
            <span>{element.label}</span>
          </div>
        ))}
      </div>
    );
  };
  
  export default Elements;
  