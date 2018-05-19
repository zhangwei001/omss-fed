export default {
    name: 'RenderTool',
    functional: true,
    props: {
        scope: Object,
        render: Function
    },
    render: (h, ctx) => {
        const params = ctx.props.scope || {};
        return ctx.props.render(h, params);
    }
};
