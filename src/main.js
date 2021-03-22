const DEFAULT_OPTIONS = {
    div: 'interacdiv',
};

export class Interacdiv {
    constructor({ actions, container, mode, div, ...options } = DEFAULT_OPTIONS) {
        // Get the configured container element.
        if (typeof container === 'string') {
            container = document.querySelector(container);
        }

        this.div = document.querySelector(div);
        this.container = container;
        this.mode = mode;
        this.actions = actions;
        this.options = options;
        this.assignedSegment = null;
    }

    getContainerVisibility() {
        // Get the bounding box for the lottie player or container
        const { top, height } = this.container.getBoundingClientRect();

        // Calculate current view percentage
        const current = window.innerHeight - top;
        const max = window.innerHeight + height;
        return current / max;
    }

    getContainerCursorPosition(cursorX, cursorY) {
        const { top, left, width, height } = this.container.getBoundingClientRect();

        const x = (cursorX - left) / width;
        const y = (cursorY - top) / height;

        return { x, y };
    }

    start() {
        const Parentscope = this;
        // Configure player for start
        if (this.mode === 'scroll') {
            this.div.addEventListener('DOMLoaded', function () {
                Parentscope.div.style['animation-play-state'] = 'paused';
                window.addEventListener('scroll', Parentscope.#scrollHandler);
            });
        }

        // if (this.mode === 'cursor') {
        //     this.div.addEventListener('DOMLoaded', function () {
        //         Parentscope.div.loop = true;
        //         Parentscope.div.stop();
        //         Parentscope.container.addEventListener('mousemove', Parentscope.#mousemoveHandler);
        //         Parentscope.container.addEventListener('mouseout', Parentscope.#mouseoutHandler);
        //     });
        // }
    }

    stop() {
        if (this.mode === 'scroll') {
            window.removeEventListener('scroll', this.#scrollHandler);
        }

        // if (this.mode === 'cursor') {
        //     this.container.addEventListener('mousemove', this.#mousemoveHandler);
        //     this.container.addEventListener('mouseout', this.#mouseoutHandler);
        // }
    }

    // #mousemoveHandler = e => {
    //     this.#cursorHandler(e.clientX, e.clientY);
    // };
    //
    // #mouseoutHandler = () => {
    //     this.#cursorHandler(-1, -1);
    // };

    #scrollHandler = () => {
        // Get container visibility percentage
        const currentPercent = this.getContainerVisibility();

        // Find the first action that satisfies the current position conditions
        const action = this.actions.find(
            ({ visibility }) => currentPercent >= visibility[0] && currentPercent <= visibility[1],
        );

        // Skip if no matching action was found!
        if (!action) {
            return;
        }

        // Process action types:
        if (action.type === 'play') {
            this.div.style['animation-play-state'] = 'running';
        } else if (action.type === 'stop') {
            this.div.style['animation-play-state'] = 'paused';
        }
    };
}

export const create = options => {
    const instance = new Interacdiv(options);
    instance.start();

    return instance;
};

export default create;
