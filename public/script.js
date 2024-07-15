const fields = {
    Deployment: [
        { name: "name", label: "Name", required: true },
        { name: "image", label: "Container Image", required: true },
        { name: "replicas", label: "Replicas", required: true },
        { name: "volume", label: "Volume", required: false },
    ],
    Service: [
        { name: "name", label: "Name", required: true },
        { name: "type", label: "Service Type", required: true },
        { name: "port", label: "Port", required: true },
    ],
    ConfigMap: [
        { name: "name", label: "Name", required: true },
        { name: "data", label: "Data", required: true },
    ]
};

function updateForm() {
    const manifestType = document.getElementById("manifestType").value;
    const formFieldsDiv = document.getElementById("formFields");
    formFieldsDiv.innerHTML = "";
    if (fields[manifestType]) {
        fields[manifestType].forEach(field => {
            const fieldHtml = `
                <label for="${field.name}">${field.label}${field.required ? '*' : ''}:</label>
                <input type="${field.required ? 'text' : 'text'}" id="${field.name}" name="${field.name}" ${field.required ? 'required' : ''}>
                <br>
            `;
            formFieldsDiv.innerHTML += fieldHtml;
        });
    }
}

function showPreview() {
    const form = document.getElementById("manifestForm");
    const formData = new FormData(form);
    const previewContent = document.getElementById("previewContent");
    const manifestType = formData.get("manifestType");
    const manifestData = Object.fromEntries(formData);

    let manifest = {};

    if (manifestType === 'Deployment') {
        manifest = {
            apiVersion: 'apps/v1',
            kind: 'Deployment',
            metadata: {
                name: manifestData.name,
            },
            spec: {
                replicas: parseInt(manifestData.replicas),
                selector: {
                    matchLabels: {
                        app: manifestData.name
                    }
                },
                template: {
                    metadata: {
                        labels: {
                            app: manifestData.name
                        }
                    },
                    spec: {
                        containers: [{
                            name: manifestData.name,
                            image: manifestData.image
                        }]
