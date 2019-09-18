import RenderDom from '~/entry';

RenderDom(require.context('~/pages/diff/', true, /\.js$/));
