interface BadgeProps {
    color: string;
}

const Badge: React.FC<BadgeProps> = ({ color }) => {
    return (
        <span
            style={{
                display: "inline-block",
                width: 12,
                height: 12,
                marginRight: 8,
                backgroundColor: color,
                borderRadius: 2,
                border: "1px solid rgba(0, 0, 0, 0.5)",
            }}
        />
    );
};

export default Badge;
