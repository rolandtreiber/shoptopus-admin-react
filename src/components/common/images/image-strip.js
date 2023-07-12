
const imageStrip = ({images}) => {
    return <div className={"image-strip-container"}>
        {images.map((image) => (<div className={"individual-image"} style={{}}/>))}
    </div>
}

export default imageStrip