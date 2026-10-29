# CardioCloud / public engineering case study

An end-to-end biomedical AI prototype, built and validated on AWS. This edition adds explicit personal contribution, larger product fragments, a technical closing decision and a 25-second product cut. It is a separate publication package; the private originals are not included.

## Open the case study

- `index.html`: responsive standalone HTML/CSS/JS; no build step or AWS backend is needed.
- `CardioCloud-case-study.pdf`: six editorial pages with bookmarks and links to the public evidence derivatives.
- `hero.png` / `hero.webp`: 1920 x 1080 cover.
- `gallery/`: six compositions in PNG, WebP and editable SVG.
- `diagrams/`: simplified and detailed architecture; the technical version uses separate connector lanes and embeds its font.
- `video/CardioCloud-product-cut.mp4`: 25 seconds, 1080p/30fps, original procedural sound design, no narration.
- `video/CardioCloud-showcase.mp4`: the existing extended 45-second silent film.
- `evidence/records/`: allowlisted public derivatives, explicitly labelled as such.
- `sources/`: editable renderers, public ECG signal, presentation adjustments and provenance.

Preview locally:

```shell
python -m http.server 8771 --bind 127.0.0.1
```

Open `http://127.0.0.1:8771/`. This address is a local preview, not a live AWS endpoint. The infrastructure has been decommissioned. Viewing or rebuilding these artifacts creates no AWS resources.

## My role & engineering decisions

**AI / ML & Cloud Engineering: end-to-end delivery with AI-assisted tooling.** The role covers model development, architecture, application integration and verification. It does not imply that every line was manually authored without assistance.

- Trained and evaluated the PyTorch ECG model using patient-safe PTB-XL folds and a held-out test split.
- Defined Terraform infrastructure, scoped IAM roles, private subnet processing and service endpoints.
- Integrated Cognito/PKCE, asynchronous jobs, SageMaker inference, Bedrock checks and persisted human review.
- Verified the browser workflow, model metrics, SQL exports and scoped teardown recovery.

The closing section highlights a concrete design choice: generated text is validated before display. During the actual demonstration, Bedrock was invoked, but its output failed strict structured/evidence validation. The application used a labelled deterministic fallback and still required a human review. This protects traceability without pretending the language model produced an accepted clinical interpretation.

## Measured results and recorded validation

The model was trained locally on an NVIDIA RTX 4060 using public PTB-XL v1.0.3. The independent test contains 2,158 records. Macro AUROC is 0.9178536552499468, rounded to 0.918. Per-class AUROC: NORM 0.93701343, STTC 0.92915157, CD 0.91715311, HYP 0.90361186 and MI 0.90233831. These are discrimination estimates, not clinical accuracy percentages. No ROC curves, distributions or uncertainty bands have been invented.

The temporary deployment in eu-west-3 was validated on 27 October 2026. CloudFront served private S3 content. Cognito authorization-code sign-in with PKCE protected API access. Private Lambda processing and Step Functions connected a real SageMaker CPU endpoint, constrained Bedrock invocation, DynamoDB review persistence and S3/Parquet exports queried with Athena. CodeBuild built outside the private VPC, the ECR image was pinned by digest and a versioned model package was registered.

Eighty Python tests and additional local checks passed. The final scoped audit on 29 October recorded six provisioned runs cleared, with no project resources or discovery errors within that scope.

| Public claim | Public derivative |
|---|---|
| Test metrics and class results | `evidence/records/report.json` |
| Dataset integrity and folds | `evidence/records/data-audit.json` |
| Deployment, scan counts and recovery facts | `evidence/records/aws-deployment.json` |
| Cognito/PKCE, inference and recorded review | `evidence/records/aws-browser-validation.json` |
| Athena statistics and build outcomes | `evidence/records/aws-operations.json` |
| Local checks | `evidence/records/local-verification.json` |
| Six-run scoped cleanup | `evidence/records/aws-cleanup-audit.json` |

## Publication boundary

This folder is the public edition. The existing full-evidence packages are private and should not be uploaded as portfolio assets. Public JSON uses explicit field allowlists rather than copying all raw API payloads. Account identifiers, resource names, operational URLs, Cognito client identifiers, UUIDs, raw commands/logs, local paths, account plan details and credit balances are excluded. The public summaries retain actual booleans, dates, metrics, scan counts and failure/recovery outcomes.

Raw JSON and full original screenshots remain unchanged in the separate private archive. This package does not describe the public derivatives as byte-identical original AWS responses. Source crop pixels are retained under `assets/crops/`; uniform presentation derivatives are under `assets/presentation/`. A privacy review report is included under `qa/`. No service was published or reactivated during this revision.

## Image and motion treatment

Presentation images apply a uniform brightness factor of 1.15 and contrast factor of 1.03. Review controls are enlarged through a documented crop, not recreated. No numbers, labels, states or clinical results are rewritten. The adjustments are reproducible with `sources/prepare_presentation.py` and recorded in `sources/presentation-adjustments.json`. The authentic source resolution limits fine UI detail; opening an image displays the unadjusted crop for inspection.

Both films are edited from actual UI captures and records. Neither is a continuous live deployment recording. The 25-second cut uses real ECG animation, moving UI close-ups and an editorial pointer that focuses an already recorded review control. It does not simulate a new click or a new AWS execution. The short cut has original synthesized tonal ambience and transition accents, without third-party samples or a synthetic voice. The extended cut remains silent.

## Responsible scope

- Research prototype. Not intended for clinical diagnosis. No external clinical validation or compliance certification is claimed.
- One availability zone; no high-availability production claim.
- Three HIGH ECR image findings remained for remediation before production.
- The two-user ownership integration check invoked the actual Lambda through IAM with two Cognito subjects (200/404); it was not a two-browser JWT-session test.
- No load/SLO or model update/rollback validation was performed. An example inference time is not an SLO.
- The model package remained PendingManualApproval; registry approval enforcement was not demonstrated.
- Expiry tags, a direct-SDK Step Functions watchdog and a complementary guardian reduced exposure but did not guarantee a monetary cap. No attributable final project invoice is claimed.

The first teardown was not flawless. Generated SageMaker lineage associations blocked original cleanup. Scoped recovery inspected ownership and incoming/outgoing associations before deleting wholly owned metadata. Renewed authentication and reviewed retries preceded the successful final audit. The public record preserves the original failure separately from the final recovered state. The audit covers project resources in Paris and relevant global services, not an assertion that the whole AWS account was empty.

## Reproduce and integrate

The page matches the original app's vanilla HTML/CSS/JS stack. Copy the section and relative asset links into a portfolio. It has no analytics or external runtime dependency, uses self-hosted licensed Inter, supports reduced motion and includes native image enlargement, keyboard Escape, mobile navigation and optional technical notes.

Optional authoring dependencies:

```shell
python -m pip install -r sources/requirements.txt
python sources/build_assets.py
python sources/render_product_cut.py
```

The static renderer recreates the compositions and presentation derivatives; the product renderer recreates the short film and its original soundtrack. `sources/render_showcase.py` preserves the editable extended-film project. SVG text remains editable and embeds the licensed font. Public evidence contains the required scientific inputs, so rebuilding does not require private records or AWS access.
