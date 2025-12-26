import asyncio
import aiohttp
import time
import os
import sys

# Configuration
API_URL = "http://localhost:8002/api/v1/scanner/"
CONCURRENT_REQUESTS = 10
TOTAL_REQUESTS = 20
IMAGE_PATH = "../frontend/public/gold_bull.png"  # Path relative to CWD (backend)

async def upload_image(session, current_req, total_req):
    if not os.path.exists(IMAGE_PATH):
        print(f"Error: Image not found at {IMAGE_PATH}")
        return False, 0, "Image missing"

    start_time = time.time()
    try:
        with open(IMAGE_PATH, 'rb') as f:
            data = aiohttp.FormData()
            data.add_field('file', f, filename='test_receipt.png', content_type='image/png')
            
            async with session.post(API_URL, data=data) as response:
                duration = time.time() - start_time
                status = response.status
                
                # Try to get key info if we added headers (we didn't, but can check body)
                # response_text = await response.text()
                
                if status == 200:
                    print(f"[{current_req}/{total_req}] Success in {duration:.2f}s")
                    return True, duration, "OK"
                else:
                    text = await response.text()
                    print(f"[{current_req}/{total_req}] Failed ({status}) in {duration:.2f}s | Error: {text[:200]}")
                    return False, duration, str(status)

    except Exception as e:
        duration = time.time() - start_time
        print(f"[{current_req}/{total_req}] Error: {str(e)}")
        return False, duration, str(e)

async def main():
    print(f"Starting Stress Test: {TOTAL_REQUESTS} requests ({CONCURRENT_REQUESTS} concurrent)")
    print(f"Target: {API_URL}")
    
    async with aiohttp.ClientSession() as session:
        tasks = []
        for i in range(TOTAL_REQUESTS):
            tasks.append(upload_image(session, i+1, TOTAL_REQUESTS))
            # Batch them if needed, or just let them race
            if len(tasks) >= CONCURRENT_REQUESTS:
                await asyncio.gather(*tasks)
                tasks = []
        
        if tasks:
            await asyncio.gather(*tasks)

if __name__ == "__main__":
    if sys.platform == 'win32':
        asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy())
    asyncio.run(main())
