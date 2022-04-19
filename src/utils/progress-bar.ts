import { Presets, SingleBar } from 'cli-progress';
import process from 'process';

let bar: SingleBar;

function formatter(options, params, payload) {
  // bar grows dynamically by current progress - no whitespaces are added
  const _bar = options.barCompleteString.substr(0, Math.round(params.progress * options.barsize));

  return '# uploading ' + payload.task + '   ' + params.value + '/' + params.total + ' --[' + _bar + ']-- ';
}

export const getProgressBar = () => {
  if (!bar) {
    bar = new SingleBar({ clearOnComplete: true, format: formatter, stream: process.stdout }, Presets.shades_classic);
    return bar;
  }
  return bar;
};
