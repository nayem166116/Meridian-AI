document.addEventListener("DOMContentLoaded", function () {
  var root = document.querySelector("[data-tool]");
  if (!root || typeof MERIDIAN_MOCK === "undefined") return;

  var presets = MERIDIAN_MOCK.tryAgent;
  var currentPreset = "lead";

  var tabs = root.querySelectorAll("[data-preset]");
  var input = root.querySelector("[data-tool-input]");
  var label = root.querySelector("[data-tool-label]");
  var errorMsg = root.querySelector("[data-tool-input-error]");
  var exampleWrap = root.querySelector("[data-tool-examples]");
  var runBtn = root.querySelector("[data-run-btn]");
  var errorBtn = root.querySelector("[data-error-btn]");
  var clearBtn = root.querySelector("[data-clear-btn]");

  var stateEmpty = root.querySelector("[data-state='empty']");
  var stateLoading = root.querySelector("[data-state='loading']");
  var stateResult = root.querySelector("[data-state='result']");
  var stateError = root.querySelector("[data-state='error']");
  var loadingStepsWrap = root.querySelector("[data-loading-steps]");
  var resultBody = root.querySelector("[data-result-body]");
  var retryBtn = root.querySelector("[data-retry-btn]");

  var loadingTimers = [];

  function showState(state) {
    [stateEmpty, stateLoading, stateResult, stateError].forEach(function (el) {
      if (el) el.classList.remove("is-active");
    });
    if (state) state.classList.add("is-active");
  }

  function renderPreset(key) {
    currentPreset = key;
    var preset = presets[key];
    tabs.forEach(function (t) {
      t.classList.toggle("tabs__tab--active", t.dataset.preset === key);
    });
    if (label) label.textContent = preset.fieldLabel;
    if (input) {
      input.placeholder = preset.placeholder;
      input.value = "";
    }
    if (errorMsg) errorMsg.classList.remove("is-visible");
    if (input) input.classList.remove("input--error");
    if (exampleWrap) {
      exampleWrap.innerHTML = "<span class=\"text-body-sm\" style=\"color:var(--text-muted);\">Try an example:</span>";
      preset.examples.forEach(function (ex, i) {
        var btn = document.createElement("button");
        btn.type = "button";
        btn.className = "chip";
        btn.textContent = "Example " + (i + 1);
        btn.title = ex;
        btn.addEventListener("click", function () {
          input.value = ex;
          input.focus();
        });
        exampleWrap.appendChild(btn);
      });
    }
    clearTimers();
    showState(stateEmpty);
  }

  tabs.forEach(function (tab) {
    tab.addEventListener("click", function () { renderPreset(tab.dataset.preset); });
  });

  function clearTimers() {
    loadingTimers.forEach(function (t) { clearTimeout(t); });
    loadingTimers = [];
  }

  function runLoadingSequence(onDone) {
    var preset = presets[currentPreset];
    loadingStepsWrap.innerHTML = "";
    var stepEls = preset.steps.map(function (text) {
      var el = document.createElement("div");
      el.className = "loading-step";
      el.innerHTML = "<span class=\"loading-step__icon\"></span><span>" + text + "</span>";
      loadingStepsWrap.appendChild(el);
      return el;
    });
    showState(stateLoading);
    clearTimers();
    stepEls.forEach(function (el, i) {
      loadingTimers.push(setTimeout(function () {
        stepEls.forEach(function (s) { s.classList.remove("is-active"); });
        el.classList.add("is-active");
        if (i > 0) stepEls[i - 1].classList.remove("is-active");
        if (i > 0) stepEls[i - 1].classList.add("is-done");
      }, i * 650));
    });
    loadingTimers.push(setTimeout(function () {
      stepEls.forEach(function (s) { s.classList.add("is-done"); s.classList.remove("is-active"); });
    }, stepEls.length * 650));
    loadingTimers.push(setTimeout(onDone, stepEls.length * 650 + 500));
  }

  function buildLeadResult(text) {
    var isLowFit = /student|personal email|hasn't opened|no budget/i.test(text);
    if (isLowFit) {
      return "<div class=\"tool-result\">" +
        "<div class=\"tool-result__header\"><span class=\"badge badge--outline\">Cold lead</span></div>" +
        "<div class=\"tool-result__score\"><span class=\"tool-result__score-num\">28</span><span class=\"text-body-sm\">/ 100 fit score</span></div>" +
        "<div class=\"tool-result__list\">" +
        "<div class=\"tool-result__list-item\"><i class=\"fa-solid fa-circle-check\"></i> No company or title information detected</div>" +
        "<div class=\"tool-result__list-item\"><i class=\"fa-solid fa-circle-check\"></i> Personal email domain, low buying signal</div>" +
        "<div class=\"tool-result__list-item\"><i class=\"fa-solid fa-circle-check\"></i> No engagement since signup</div>" +
        "</div>" +
        "<div class=\"tool-result__block\"><strong>Recommendation:</strong> Add to nurture sequence. Do not route to a rep yet.</div>" +
        "</div>";
    }
    return "<div class=\"tool-result\">" +
      "<div class=\"tool-result__header\"><span class=\"badge badge--primary\">Hot lead</span></div>" +
      "<div class=\"tool-result__score\"><span class=\"tool-result__score-num\">91</span><span class=\"text-body-sm\">/ 100 fit score</span></div>" +
      "<div class=\"tool-result__list\">" +
      "<div class=\"tool-result__list-item\"><i class=\"fa-solid fa-circle-check\"></i> Senior title with buying authority detected</div>" +
      "<div class=\"tool-result__list-item\"><i class=\"fa-solid fa-circle-check\"></i> Company size matches your ideal customer profile</div>" +
      "<div class=\"tool-result__list-item\"><i class=\"fa-solid fa-circle-check\"></i> High-intent action: requested a demo</div>" +
      "</div>" +
      "<div class=\"tool-result__block\"><strong>Recommendation:</strong> Route to Alex Kim (Enterprise AE) within the hour.</div>" +
      "</div>";
  }

  function buildTicketResult(text) {
    var isUrgent = /urgent|refund|charged|asap|down|broken/i.test(text);
    if (isUrgent) {
      return "<div class=\"tool-result\">" +
        "<div class=\"tool-result__header\"><span class=\"badge badge--outline\">Billing</span><span class=\"badge badge--primary\">Urgent</span></div>" +
        "<div class=\"tool-result__block\"><strong>Draft reply:</strong><br>Hi there, I'm sorry about the duplicate charge - I can see the issue and I've flagged it for our billing team to refund immediately. You'll see it reflected within 3-5 business days. I'll follow up as soon as it's processed.</div>" +
        "<div class=\"tool-result__list\">" +
        "<div class=\"tool-result__list-item\"><i class=\"fa-solid fa-circle-check\"></i> Escalated to billing team automatically</div>" +
        "<div class=\"tool-result__list-item\"><i class=\"fa-solid fa-circle-check\"></i> Tagged: billing, refund, urgent</div>" +
        "</div></div>";
    }
    return "<div class=\"tool-result\">" +
      "<div class=\"tool-result__header\"><span class=\"badge badge--outline\">Product question</span><span class=\"badge badge--neutral\">Low priority</span></div>" +
      "<div class=\"tool-result__block\"><strong>Draft reply:</strong><br>Hi! Yes - you can export your full agent run history to CSV from Settings -> Data Export. Let me know if you run into any trouble.</div>" +
      "<div class=\"tool-result__list\">" +
      "<div class=\"tool-result__list-item\"><i class=\"fa-solid fa-circle-check\"></i> Answer found in help documentation</div>" +
      "<div class=\"tool-result__list-item\"><i class=\"fa-solid fa-circle-check\"></i> Tagged: product-question, export</div>" +
      "</div></div>";
  }

  function buildMeetingResult(text) {
    return "<div class=\"tool-result\">" +
      "<div class=\"tool-result__header\"><span class=\"badge badge--primary\">Summary ready</span></div>" +
      "<div class=\"tool-result__block\">The team reviewed current priorities and confirmed timeline changes. Ownership was assigned for the immediate next steps, with follow-up expected before the next sync.</div>" +
      "<p class=\"text-body-sm\" style=\"font-weight:600; color:var(--text-heading);\">Action items</p>" +
      "<div class=\"tool-result__list\">" +
      "<div class=\"tool-result__list-item\"><i class=\"fa-solid fa-square-check\"></i> Finalize updated timeline - Owner: Priya</div>" +
      "<div class=\"tool-result__list-item\"><i class=\"fa-solid fa-square-check\"></i> Loop in legal / stakeholders - Owner: Marcus</div>" +
      "<div class=\"tool-result__list-item\"><i class=\"fa-solid fa-square-check\"></i> Share summary with wider team - Owner: You</div>" +
      "</div></div>";
  }

  function buildResult(text) {
    if (currentPreset === "lead") return buildLeadResult(text);
    if (currentPreset === "ticket") return buildTicketResult(text);
    return buildMeetingResult(text);
  }

  function run() {
    var text = input.value.trim();
    if (!text) {
      input.classList.add("input--error");
      if (errorMsg) errorMsg.classList.add("is-visible");
      return;
    }
    input.classList.remove("input--error");
    if (errorMsg) errorMsg.classList.remove("is-visible");
    runLoadingSequence(function () {
      resultBody.innerHTML = buildResult(text);
      showState(stateResult);
    });
  }

  function simulateError() {
    var preset = presets[currentPreset];
    loadingStepsWrap.innerHTML = "";
    var el = document.createElement("div");
    el.className = "loading-step is-active";
    el.innerHTML = "<span class=\"loading-step__icon\"></span><span>" + preset.steps[0] + "</span>";
    loadingStepsWrap.appendChild(el);
    showState(stateLoading);
    clearTimers();
    loadingTimers.push(setTimeout(function () { showState(stateError); }, 1100));
  }

  if (runBtn) runBtn.addEventListener("click", run);
  if (errorBtn) errorBtn.addEventListener("click", simulateError);
  if (retryBtn) retryBtn.addEventListener("click", run);
  if (clearBtn) clearBtn.addEventListener("click", function () {
    input.value = "";
    input.classList.remove("input--error");
    if (errorMsg) errorMsg.classList.remove("is-visible");
    clearTimers();
    showState(stateEmpty);
  });
  if (input) input.addEventListener("input", function () {
    if (input.value.trim()) {
      input.classList.remove("input--error");
      if (errorMsg) errorMsg.classList.remove("is-visible");
    }
  });

  renderPreset("lead");
});
