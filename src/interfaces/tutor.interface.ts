export interface ITutorStep {
    element: string;
    popover: {
        title: string;
        description: string;
        side: "top" | "bottom" | "left" | "right";
        align: "start" | "end";
        onNextClick?: () => void;
    };
}
