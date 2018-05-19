export default {
    name: 'TableExpand',
    functional: true,
    props: {
        scope: Object,
        render: Function
    },
    render: (h, ctx) => {
        const params = {
            row: ctx.props.scope.row,
            index: ctx.props.scope.$index
        };
        if (ctx.props.scope.column) params.column = ctx.props.scope.column;
        return ctx.props.render(h, params);
    }
};
