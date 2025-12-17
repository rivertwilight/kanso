import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Image from "next/image";

const GalleryContainer = styled.div`
	display: flex;
	flex-wrap: wrap;
	justify-content: center;
	align-items: center;
	@media (max-width: 768px) {
		flex-direction: column;
	}
`;

const ImageFrame = styled.div`
	margin: 20px;
	padding: 15px;
	background: white;
	border-radius: 8px;
	box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
	transform: rotate(${(props) => props.angle}deg);
	max-width: 800px;
	@media (max-width: 768px) {
		max-width: 90vw;
	}
`;

const ImageInner = styled.img`
	width: 100%;
	height: auto;
	border-radius: 0px;
`;

const Caption = styled.p`
	font-family: "Patrick Hand", cursive;
	text-align: ${(props) => props.align};
	margin: 10px 0 0;
	font-size: 1.2rem;
`;

const PhotoWrapper = styled.div`
	position: relative;
`;

const DateStamp = styled.p`
	position: absolute;
	bottom: 18px;
	left: 18px;
	margin: 0;
	padding: 2px;
	font-family: Inconsolata, Monaco, Consolas, "Courier New", Courier,
		monospace, "Arial", sans-serif;
	font-size: 1rem;
	color: orange;
	background-color: rgba(0, 0, 0, 0.5);
	border-radius: 2px;
`;
const StyledImage = styled(Image)`
	border-radius: 0px;
`;

const Gallery = ({ photos }) => {
	const [selectedPhotos, setSelectedPhotos] = useState([]);

	useEffect(() => {
		const shuffledPhotos = [...photos].sort(() => Math.random() - 0.5);
		setSelectedPhotos(shuffledPhotos.slice(0, 4));
	}, []);

	return (
		<GalleryContainer>
			{selectedPhotos.map((photo, index) => {
				const randomAngle = Math.floor(Math.random() * 6) - 3;
				const positions = ["left", "center", "right"];
				const randomPosition =
					positions[Math.floor(Math.random() * positions.length)];

				return (
					<ImageFrame key={index} angle={randomAngle}>
						<PhotoWrapper>
							<StyledImage
								src={photo.imageUrl}
								alt={photo.alt}
								width={800} // Adjust these values as per your layout requirements
								height={450} // Adjust these values as per your layout requirements
								layout="responsive" // Optional, but recommended for responsive images
							/>
							<DateStamp>{photo.date}</DateStamp>
						</PhotoWrapper>
						<Caption align={randomPosition}>
							{photo.caption}
						</Caption>
					</ImageFrame>
				);
			})}
		</GalleryContainer>
	);
};

export default Gallery;
