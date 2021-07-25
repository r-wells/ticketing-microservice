import axios from "axios";

const buildClient = ({ req }) => {
    if (typeof window === 'undefined') {
        return axios.create({
            baseURL: 'http://ticketing-prod-app-reach-two.xyz',
            // baseURL: 'http://ingress-nginx-controller.ingress-nginx.svc.cluster.local',
            headers: req.headers
        });
    } else {
        return axios.create({
            baseURL: '/'
        });
    }
}

export default buildClient;