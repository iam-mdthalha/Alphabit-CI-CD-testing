type ProductVideoProps = {
    videoUrl: string;
}

export default function ProductVideo({ videoUrl }: ProductVideoProps) {
    return (
        <div className="p-6">
            <iframe
                className="w-full aspect-video"
                src={videoUrl}
                title="Product Video"
                frameBorder="0"
                allowFullScreen
            ></iframe>
        </div>
    );
}
