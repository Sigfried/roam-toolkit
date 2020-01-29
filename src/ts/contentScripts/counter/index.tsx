import {browser} from 'webextension-polyfill-ts';

import {createDomAnchor} from '../../scripts/dom';

createDomAnchor('counter-root');

const inputEvent = new Event('input', {
    bubbles: true,
    cancelable: true,
});

const bucketExpr = /\[\[Bucket (\d+)]]/;

const nextBucket = (nodeStr: string) => `[[Bucket ${parseInt(nodeStr) + 1}]]`;

function triggerNextBucket() {
    const element = document.activeElement!;
    if (element.tagName.toLocaleLowerCase() !== 'textarea') {
        return
    }

    element.nodeValue = element.nodeValue!.replace(bucketExpr, (_, numStr: string) => nextBucket(numStr));
    element.dispatchEvent(inputEvent);
}

browser.runtime.onMessage.addListener((command) => {
    if (command === 'srs-next-bucket') {
        console.log('Toggling the feature!');
        triggerNextBucket();
    }
});
